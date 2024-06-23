var http = require('http');
const url = require('url');
var querystring = require('querystring');

const authentification_worker = require('./workers/auth_worker.js');
const user_worker = require('./workers/user_worker.js');
const group_worker = require('./workers/group_worker.js');
const admin_worker = require('./workers/admin_worker.js');
const {serveStaticFiles} = require("./workers/fetch_worker");

http.createServer((req, res) =>
{
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 
     if (req.method === 'OPTIONS') {
         res.writeHead(204);
         res.end();
         return;
     }

    if (req.url.startsWith('/api'))
    {
        req.url = req.url.slice(4);
    } 
    else 
    {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Request not found!');
        return;
    }
   
    const parsedUrl = url.parse(req.url, true);

    if(parsedUrl.pathname.startsWith('/src/uploads/'))
    {
        serveStaticFiles(req, res);
    }
    else switch (req.method)
    {
        case 'POST':
            switch (parsedUrl.pathname)
            {
                case '/register':
                    authentification_worker.handle_register(req, res);
                    break;
                case '/login':
                    authentification_worker.handle_login(req, res);
                    break;
                case '/insert_children':
                    user_worker.insertChildren(req, res);
                    break;
                case '/insert_media':
                    user_worker.insertMedia(req, res);
                    break;
                case '/insert_feeding_entry':
                    user_worker.insertFeedingEntry(req, res);
                    break;
                case '/insert_sleeping_entry':
                    user_worker.insertSleepingEntry(req, res);
                    break;
                case '/insert_health':
                    user_worker.insertHealth(req, res);
                    break;
                case '/insert_group':
                    group_worker.insertGroup(req, res);
                    break;
                case '/insert_children_group':
                    group_worker.insertChildrenGroup(req, res);
                    break;
                case '/insert_group_relation':
                    group_worker.insertGroupRelation(req, res);
                    break;
                case '/insert_group_chat':
                    group_worker.insertGroupChat(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
        case 'GET':
            switch(parsedUrl.pathname)
            {
                case '/get_user_children':
                    user_worker.loadSelfChildren(req, res);
                    break;
                case '/get_feeding_entry':
                    user_worker.getFeedingEntry(req, res);
                    break;
                case '/get_feeding_entries_by_date':
                    user_worker.getFeedingEntriesByDate(req, res);
                    break;
                case '/get_sleeping_entry':
                    user_worker.getSleepingEntry(req, res);
                    break;
                case '/get_sleeping_entries_by_date':
                    user_worker.getSleepingEntriesByDate(req, res);
                    break;
                case '/get_self_info':
                    user_worker.getSelfInfo(req, res);
                    break;
                case '/get_children_media':
                    user_worker.getChildrenMedia(req, res);
                    break;
                case '/get_user_groups':
                    group_worker.getUserGroups(req, res);
                    break;
                case '/get_group_children_info':
                    group_worker.getGroupChildrenInfo(req, res);
                    break;
                case '/get_group_relations':
                    group_worker.getGroupChildrenRelations(req, res);
                    break;
                case '/get_health':
                    user_worker.getHealth(req, res);
                    break;
                case '/get_group_chat':
                    group_worker.getGroupChatByGroupId(req, res);
                    break;
                case '/authorized/get_all_users':
                    admin_worker.getAllUsers(req, res);
                    break;
                case '/authorized/get_all_children':
                    admin_worker.getAllChildren(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
        case 'PUT':
            switch(parsedUrl.pathname)
            {
                case '/modify_account_settings':
                    user_worker.editAccountSettings(req, res);
                    break;
                case '/edit_feeding_entry':
                    user_worker.editFeedingEntry(req, res);
                    break;
                case '/edit_sleeping_entry':
                    user_worker.editSleepingEntry(req, res);
                    break;
                case '/edit_group':
                    group_worker.editGroup(req, res);
                    break;
                case '/edit_group_relation':
                    group_worker.editGroupRelation(req, res);
                    break;
                case '/authorized/edit_user':
                    admin_worker.editUserParameter(req, res);
                    break;
                case '/authorized/edit_child':
                    admin_worker.editChildParameters(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;

        case 'DELETE':
            switch(parsedUrl.pathname)
            {
                case '/delete_feeding_entry':
                    user_worker.deleteFeedingEntry(req, res);
                    break;
                case '/delete_sleeping_entry':
                    user_worker.deleteSleepingEntry(req, res);
                    break;
                case '/delete_children':
                    user_worker.deleteChildren(req, res);
                    break;
                case '/delete_media':
                    user_worker.deleteMedia(req, res);
                    break;
                case '/delete_health':
                    user_worker.deleteHealth(req, res);
                    break;
                case '/delete_group':
                    group_worker.deleteGroup(req, res);
                    break;
                case '/delete_children_group':
                    group_worker.deleteChildrenGroup(req, res);
                    break;
                case '/delete_group_relation':
                    group_worker.deleteGroupRelation(req, res);
                    break;
                case '/delete_group_chat':
                    group_worker.deleteGroupChat(req, res);
                    break;
                case '/delete_relation':
                    group_worker.deleteGroupRelation(req, res);
                    break;
                case '/authorized/delete_user':
                    admin_worker.deleteUser(req, res);
                    break;
                case '/authorized/delete_child':
                    admin_worker.deleteChild(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
    }

}
).listen(5000);
console.log("Server has started!");



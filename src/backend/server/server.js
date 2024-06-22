var http = require('http');
const url = require('url');
var querystring = require('querystring');

const authentification_worker = require('./workers/auth_worker.js');
const user_worker = require('./workers/user_worker.js');
const {serveStaticFiles} = require("./workers/fetch_worker");

http.createServer((req, res) =>
{
     // Add CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include Authorization
 
     // Handle preflight requests
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
        console.log("test");
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
                case '/insert_feeding_entry':
                    user_worker.insertFeedingEntry(req, res);
                    break;
                case '/insert_sleeping_entry':
                    user_worker.insertSleepingEntry(req, res);
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
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
    }

}
).listen(5000);
console.log("Server has started!");



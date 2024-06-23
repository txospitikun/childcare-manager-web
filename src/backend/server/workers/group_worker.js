const encryption_worker = require('./encryption_worker');
const db_logic = require('./../database/database_logic');
const childrendb_logic = require('./../database/childrendb_logic');
const childreninfodb_logic = require('./../database/childreninfodb_logic');
const userdb_logic = require('./../database/userdb_logic');
const database = require('./../database/connection');
const groupdb_logic = require('./../database/groupdb_logic');
const fetch_worker = require('./fetch_worker');
const json_worker = require('./json_worker');
const cookie_worker = require('./cookie_worker');
const user_worker = require('./user_worker');
const FeedingEntryForm = require("../request_modals/feedingentryform_modal");
const SleepingEntryForm = require("../request_modals/sleepingentryform_modal");
const UpdateAccount = require("../request_modals/updateaccountform_modal");
const {parseFormData} = require("./fetch_worker");



async function insertGroup(req, res)
{
    try
    {
        const user = await user_worker.getUser(req, res);
        if(!user) return;

        const data = await parseFormData(req);

        await groupdb_logic.insertGroup(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group added sucesfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't insert group into the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function editGroup(req, res)
{
    try
    {
        const user = await user_worker.getUser(req, res);
        if(!user) return;

        const data = await parseFormData(req);

        const result = await groupdb_logic.editGroup(user.ID, data);
        if(result.affectedRows === 0)
        {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Group not found or no permissions!" }));
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group edited successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't edit group from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}


async function deleteGroup(req, res)
{
    try
    {
        const user = await user_worker.getUser(req, res);
        if(!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const groupId = parsedUrl.searchParams.get('groupId');

        const result = await groupdb_logic.deleteGroup(user.ID, groupId);
        if(result.affectedRows === 0)
        {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Group not found or no permissions!" }));
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group deleted successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't delete group from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function getUserGroups(req, res)
{
    try
    {
        const user = await user_worker.getUser(req, res);
        if(!user) return;

        const result = await groupdb_logic.getUserGroups(user.ID);
        if(result.length === 0)
        {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "No groups found or no permissions!" }));
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ groups: result }));
    }
    catch (err) {
        console.log("Server error: Couldn't get groups from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function insertChildrenGroup(req, res)
{
    try
    {
        const user = await user_worker.getUser(req, res);
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.insertChildrenGroup(data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Child added into group successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't get groups from the database! ", err);
        if(err.code === 'ER_DUP_ENTRY')
        {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Child is already in the group!" }));
            return;
        }
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}


async function deleteChildrenGroup(req, res)
{
    try
    {
        const user = await user_worker.getUser(req, res);
        if(!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const groupId = parsedUrl.searchParams.get('groupId');
        const childrenId = parsedUrl.searchParams.get('groupId');


        const data = await parseFormData(req);
        await groupdb_logic.deleteChildrenGroup(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Children deleted from group successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't delete children from a group from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function insertGroupRelation(res, req)
{
    try
    {
        const user = await user_worker.getUser();
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.insertGroupRelation(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group relation added successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't add group relation into the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function editGroupRelation(res, req)
{
    try
    {
        const user = await user_worker.getUser();
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.editGroupRelation(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group relation edited successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't edit group relation from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function deleteGroupRelation(res, req)
{
    try
    {
        const user = await user_worker.getUser();
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.deleteGroupRelation(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group relation deleted successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't delete group relation from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function insertGroupChat(res, req)
{
    try
    {
        const user = await user_worker.getUser();
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.insertGroupChat(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group chat added successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't add group chat into the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function deleteGroupChat(res, req)
{
    try
    {
        const user = await user_worker.getUser();
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.insertChildrenGroup(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Group chat deleted successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't delete group chat from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

async function getGroupChatByGroupId(res, req)
{
    try
    {
        const user = await user_worker.getUser();
        if(!user) return;

        const data = await parseFormData(req);
        await groupdb_logic.getGroupChat(user.ID, data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "sdad successfully!" }));
    }
    catch (err) {
        console.log("Server error: Couldn't get group chat from the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }


}

module.exports = {getUserGroups, getGroupChatByGroupId, insertGroup, editGroup, deleteGroup, insertChildrenGroup, deleteChildrenGroup, insertGroupRelation, editGroupRelation, deleteGroupRelation, insertGroupChat, deleteGroupChat};

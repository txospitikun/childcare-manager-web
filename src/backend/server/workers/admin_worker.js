const encryption_worker = require('./encryption_worker');
const db_logic = require('./../database/database_logic');
const childrendb_logic = require('./../database/childrendb_logic');
const childreninfodb_logic = require('./../database/childreninfodb_logic');
const userdb_logic = require('./../database/userdb_logic');
const database = require('./../database/connection');
const groupdb_logic = require('./../database/groupdb_logic');
const admindb_logic = require('./../database/admindb_logic');
const fetch_worker = require('./fetch_worker');
const json_worker = require('./json_worker');
const cookie_worker = require('./cookie_worker');
const user_worker = require('./user_worker');
const FeedingEntryForm = require("../request_modals/feedingentryform_modal");
const SleepingEntryForm = require("../request_modals/sleepingentryform_modal");
const UpdateAccount = require("../request_modals/updateaccountform_modal");
const {parseFormData} = require("./fetch_worker");


async function getAllUsers(req, res)
{
    const user = await user_worker.getUser(req, res);
    if (!user) return;

    if(user.Privilege !== 1) {
        res.writeHead(401, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Unauthorized access!"}));
        return;
    }

    try {
        const users = await admindb_logic.getAllUsers();
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify(users));
    } catch (error) {
        console.error('Error getting all users:', error);
        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Error getting all users!"}));
    }
}

async function getAllChildren(req, res) {
    const user = await user_worker.getUser(req, res);
    if (!user) return;

    if (user.Privilege !== 1) {
        res.writeHead(401, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Unauthorized access!"}));
        return;
    }


    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const ID = parsedUrl.searchParams.get('userId');


    try {
        const children = await childrendb_logic.getAllChildren(ID);
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify(children));
    } catch (error) {
        console.error('Error getting all children:', error);
        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Error getting all children!"}));
    }
}

async function editUserParameter(req, res)
{
    const user = await user_worker.getUser(req, res);
    if (!user) return;

    if(user.Privilege !== 1) {
        res.writeHead(401, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Unauthorized access!"}));
        return;
    }

    try {
        const parsedData = await fetch_worker.handle_request(req);
        const updatedUser = await admindb_logic.editUserParameter(parsedData);
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify(updatedUser));
    } catch (error) {
        console.error('Error editing user parameter:', error);
        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Error editing user parameter!"}));
    }

}

async function editChildParameters(req, res) {
    const user = await user_worker.getUser(req, res);
    if (!user) return;

    if (user.Privilege !== 1) {
        res.writeHead(401, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Unauthorized access!"}));
        return;
    }

    try {
        const parsedData = await fetch_worker.handle_request(req);
        const updatedChild = await admindb_logic.editChild(parsedData);
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify(updatedChild));
    } catch (error) {
        console.error('Error editing child:', error);
        res.writeHead(400, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Invalid input parameters!"}));
    }
}

async function deleteUser(req, res) {
    const user = await user_worker.getUser(req, res);
    if (!user) return;

    if(user.Privilege !== 1) {
        res.writeHead(401, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Unauthorized access!"}));
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const userId = parsedUrl.searchParams.get('userID');
        const deletedUser = await admindb_logic.deleteUser(userId);
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify(deletedUser));
    } catch (error) {
        console.error('Error deleting user:', error);
        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Error deleting user!"}));
    }

}

async function deleteChild(req, res)
{
const user = await user_worker.getUser(req, res);
    if (!user) return;

    if(user.Privilege !== 1) {
        res.writeHead(401, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Unauthorized access!"}));
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const childId = parsedUrl.searchParams.get('childID');
        const deletedChild = await admindb_logic.deleteChild(childId);
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify(deletedChild));
    } catch (error) {
        console.error('Error deleting child:', error);
        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Error: "Error deleting child!"}));
    }
}

module.exports = {deleteChild, deleteUser, editChildParameters, editUserParameter, getAllUsers, getAllChildren};
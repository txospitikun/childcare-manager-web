const encryption_worker = require('./encryption_worker');
const db_logic = require('./../database/database_logic');
const childrendb_logic = require('./../database/childrendb_logic');
const childreninfodb_logic = require('./../database/childreninfodb_logic');
const userdb_logic = require('./../database/userdb_logic');
const database = require('./../database/connection');
const fetch_worker = require('./fetch_worker');

const ChildrenForm = require('./../request_modals/childrenform_modal');
const ChildrenFeedingForm = require('./../request_modals/feedingentryform_modal');
const ChildrenSleepingForm = require("../request_modals/sleepingentryform_modal");

const json_worker = require('./json_worker');
const cookie_worker = require('./cookie_worker');
const FeedingEntryForm = require("../request_modals/feedingentryform_modal");
const SleepingEntryForm = require("../request_modals/sleepingentryform_modal");
const UpdateAccount = require("../request_modals/updateaccountform_modal");
const {parseFormData} = require("./fetch_worker");

async function getUser(req, res) {
    

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('JWT token not found in Authorization header');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "No authentication token" }));
        return null;
    }

    const jwtToken = authHeader.split(' ')[1];

    let decoded_jwt_token;
    try {
        decoded_jwt_token = encryption_worker.decode(jwtToken);
    } catch (error) {
        console.log('Error decoding JWT token:', error);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Invalid authentication token" }));
        return null;
    }

    if (decoded_jwt_token === false) {
        console.log('Invalid JWT token');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Invalid authentication token" }));
        return null;
    }

    const User = await userdb_logic.findUserByID(decoded_jwt_token.payload.UserID);

    if (User == null) {
        console.log('User not found, backend error.');
        throw new Error("Backend error.");
    }

    return User;
}


async function getSelfInfo(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        // Construct the URL for the image
        let imageUrl = null;
        if (user.PictureRef) {
            const relativePath = user.PictureRef.replace(/\\/g, '/');
            imageUrl = `${relativePath}`;
        }

        // Respond with user info and the image URL
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            user: {
                ...user,
                PictureRef: imageUrl
            }
        }));
    } catch (err) {
        console.log("Server error: Couldn't load user! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function getUser(req, res) {
    console.log('getUser called');

    console.log(req.headers);
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('JWT token not found in Authorization header');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "No authentication token" }));
        return null;
    }

    const jwtToken = authHeader.split(' ')[1];
    console.log('JWT Token:', jwtToken);

    let decoded_jwt_token;
    try {
        decoded_jwt_token = encryption_worker.decode(jwtToken);
    } catch (error) {
        console.log('Error decoding JWT token:', error);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Invalid authentication token" }));
        return null;
    }
    console.log('Decoded JWT Token:', decoded_jwt_token);

    if (decoded_jwt_token === false) {
        console.log('Invalid JWT token');
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Invalid authentication token" }));
        return null;
    }

    const User = await userdb_logic.findUserByID(decoded_jwt_token.payload.UserID);
    console.log('Retrieved User:', User);

    if (User == null) {
        console.log('User not found, backend error.');
        throw new Error("Backend error.");
    }

    return User;
}


async function insertChildren(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await parseFormData(req); // Use parseFormData to handle multipart form data

        const childrenform = new ChildrenForm(parsedData);

        if (json_worker.isNullOrEmpty(childrenform.FirstName) || 
            json_worker.isNullOrEmpty(childrenform.LastName) || 
            json_worker.isNullOrEmpty(childrenform.Gender) || 
            json_worker.isNullOrEmpty(childrenform.DateOfBirth) ||
            json_worker.isNullOrEmpty(childrenform.PictureRef)) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Invalid form data" }));
            return;
        }

        await childrendb_logic.insertChildren(user.ID, childrenform);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Children added successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't insert children in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function deleteChildren(req, res)
{
    try
    {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const childID = parsedUrl.searchParams.get('childID');

        await childrendb_logic.deleteChildren(user.ID, childID);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Children deleted successfully" }));
    }
    catch (err)
    {
        console.log("Server error: Couldn't delete children in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function editAccountSettings(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await parseFormData(req);
        const updateaccount = new UpdateAccount(parsedData);
        console.log(updateaccount);

        await userdb_logic.editUser(updateaccount, user.ID);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Account settings updated successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't update account settings in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }

}

async function loadSelfChildren(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const childrenInfo = await childrendb_logic.getChildrensByID(user.ID);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ childrenInfo }));
    } catch (err) {
        console.log("Server error: Couldn't load children! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function insertFeedingEntry(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await fetch_worker.handle_request(req);
        const childrenform = new ChildrenFeedingForm(parsedData);

        await childreninfodb_logic.insertFeedingEntry(user.ID, childrenform);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Feeding entry added successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't insert feeding entry in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function insertPhoto(req, res)
{
    try
    {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await parseFormData(req);

        await childreninfodb_logic.insertPhoto(user.ID, parsedData);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Photo added successfully" }));
    }
    catch (err)
    {
        console.log("Server error: Couldn't insert photo in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function getFeedingEntriesByDate(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const date = parsedUrl.searchParams.get('date');

        if (!date) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Date parameter is missing" }));
            return;
        }

        const feedingEntries = await childreninfodb_logic.getFeedingEntriesByDate(date, user.ID, parsedUrl.searchParams.get('childID'));

        if (!feedingEntries || feedingEntries.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No feeding entries found for the specified date" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ feedingEntries }));
    } catch (err) {
        console.log("Server error: Couldn't retrieve feeding entries from the database! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function getFeedingEntry(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const entryId = parsedUrl.searchParams.get('id');

        if (!entryId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "ID parameter is missing" }));
            return;
        }

        const feedingEntry = await childreninfodb_logic.getFeedingEntry(entryId, user.ID);

        if (feedingEntry.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Feeding entry not found" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ feedingEntry }));
    } catch (err) {
        console.log("Server error: Couldn't retrieve feeding entry from the database! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function editFeedingEntry(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await fetch_worker.handle_request(req);
        const feedingEntryForm = new FeedingEntryForm(parsedData);

        const result = await childreninfodb_logic.editFeedingEntry(parsedData.ID, feedingEntryForm, user.ID);

        if (result.affectedRows === 0) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Feeding entry not found" }));
            return;
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Feeding entry updated successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't edit feeding entry in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function deleteFeedingEntry(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const entryId = parsedUrl.searchParams.get('id');

        if (!entryId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "ID parameter is missing" }));
            return;
        }

        const response = await childreninfodb_logic.deleteFeedingEntry(entryId, user.ID);

        if (response.affectedRows === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Feeding entry not found" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Feeding entry deleted successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't delete feeding entry from the database! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function insertSleepingEntry(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await fetch_worker.handle_request(req);
        const childrenform = new ChildrenSleepingForm(parsedData);

        await childreninfodb_logic.insertSleepingEntry(user.ID, childrenform);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Sleeping entry added successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't insert sleeping entry in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function getSleepingEntriesByDate(req, res){
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const date = parsedUrl.searchParams.get('date');

        if (!date) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Date parameter is missing" }));
            return;
        }

        const sleepingEntries = await childreninfodb_logic.getSleepingEntriesByDate(date, user.ID, parsedUrl.searchParams.get('childID'));

        if (!sleepingEntries || sleepingEntries.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "No sleeping entries found for the specified date" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ sleepingEntries }));
    } catch (err) {
        console.log("Server error: Couldn't retrieve sleeping entries from the database! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }

}

async function getSleepingEntry(req, res) {
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const entryId = parsedUrl.searchParams.get('id');

        if (!entryId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "ID parameter is missing" }));
            return;
        }

        const sleepingEntry = await childreninfodb_logic.getSleepingEntry(entryId, user.ID);

        if (sleepingEntry.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Sleeping entry not found" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ sleepingEntry }));
    } catch (err) {
        console.log("Server error: Couldn't retrieve sleeping entry from the database! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

async function editSleepingEntry(req,res){
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedData = await fetch_worker.handle_request(req);
        const sleepingEntryForm = new SleepingEntryForm(parsedData);

        const result = await childreninfodb_logic.editSleepingEntry(parsedData.ID, sleepingEntryForm, user.ID);

        if (result.affectedRows === 0) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: "Sleeping entry not found" }));
            return;
        }

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Sleeping entry updated successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't edit sleeping entry in the database! ", err);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: "Backend error" }));
    }

}

async function deleteSleepingEntry(req,res){
    try {
        const user = await getUser(req, res);
        if (!user) return;

        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const entryId = parsedUrl.searchParams.get('id');

        if (!entryId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "ID parameter is missing" }));
            return;
        }

        const response = await childreninfodb_logic.deleteSleepingEntry(entryId, user.ID);

        if (response.affectedRows === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Sleeping entry not found" }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Sleeping entry deleted successfully" }));
    } catch (err) {
        console.log("Server error: Couldn't delete sleeping entry from the database! ", err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Backend error" }));
    }
}

module.exports = { loadSelfChildren, insertChildren, insertFeedingEntry, editFeedingEntry, getFeedingEntriesByDate, getFeedingEntry, deleteFeedingEntry, insertSleepingEntry, editSleepingEntry, getSleepingEntriesByDate, getSleepingEntry, deleteSleepingEntry, editAccountSettings, getSelfInfo, deleteChildren};


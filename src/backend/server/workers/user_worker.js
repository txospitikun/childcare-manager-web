const encryption_worker = require('./encryption_worker');
const db_logic = require('./../database/database_logic');
const childrendb_logic = require('./../database/childrendb_logic');
const userdb_logic = require('./../database/userdb_logic');
const database = require('./../database/connection');
const fetch_worker = require('./fetch_worker');

const ChildrenForm = require('./../request_modals/childrenform_modal');
const json_worker = require('./json_worker');
const cookie_worker = require('./cookie_worker');

async function insertChildren(req, res)
{
    try
    {
        const parsedData = await fetch_worker.handle_request(req);
        const cookies = await cookie_worker.parseCookies(req);

        const decoded_jwt_token = encryption_worker.decode(cookies['JWT']);

        if(decoded_jwt_token === false)
        {
            res.writeHead(200, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({InsertChildrenResponse: 10}));
            return;
        }

        const User = await userdb_logic.findUserByID(decoded_jwt_token.payload.UserID);

        if(User == null)
        {
            throw new Error("Backend error.");
        }

        const childrenform = new ChildrenForm(parsedData);

        if(json_worker.isNullOrEmpty(childrenform.FirstName) || json_worker.isNullOrEmpty(childrenform.LastName) || json_worker.isNullOrEmpty(childrenform.Gender) || json_worker.isNullOrEmpty(childrenform.DateOfBirth))
        {
            res.writeHead(401, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({ InsertChildrenResponse: ChildrenForm.response_invalid_form_data }));
            return;
        }

        await childrendb_logic.insertChildren(User.ID, childrenform);

        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({ InsertChildrenResponse: ChildrenForm.response_children_added_succesfully }));


        console.log(childrenform);

    }
    catch(err)
    {
        console.log("Server error: Couldn't insert children in the database! ", err);

        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({ InsertChildrenResponse: ChildrenForm.response_backend_error }));
    }
}

async function loadSelfChildren(req, res)
{
    const cookies = await cookie_worker.parseCookies(req);
    const decoded_jwt_token = encryption_worker.decode(cookies['JWT']);
    if(decoded_jwt_token === false)
    {
        console.log("JWT couldn't be authentificated.");
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Response: 201, UserInfo: null}));
    }
    else
    {
        
        let childrenInfo = await childrendb_logic.getChildrensByID(decoded_jwt_token.payload.UserID);
        console.log(childrenInfo);
        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({Response: 202, ChildrenInfo: childrenInfo}));
    }
}

module.exports = {loadSelfChildren, insertChildren}
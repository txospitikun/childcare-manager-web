const encryption_worker = require('./encryption_worker')('d4e5f6a1b3c4d7e8f9a2b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6');;
const db_logic = require('./../database/database_logic');
const database = require('./../database/connection');

async function loadUser(req, res)
{
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        let data = JSON.parse(body);
        let decodedToken = encryption_worker.decode(data);
        if(decodedToken === false)
        {
            console.log("JWT couldn't be authentificated.");
            res.writeHead(200, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({Response: 201, UserInfo: null}));
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({Response: 200, UserInfo: decodedToken}));
        }

    });
}

async function insertChildren(req, res)
{
    let body = '';
    req.on('data', (chunk) => 
    {
        body += chunk.toString();
    });

    req.on('end', async () =>
    {
        const data = JSON.parse(body);
        let decodedJWTToken = encryption_worker.decode(data["JWT"]);

        if(decodedJWTToken === false)
        {
            console.log("JWT couldn't be authentificated.");
            res.writeHead(200, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({Response: 201, UserInfo: null}));
        }
        else
        {
            const client = await database.connect();
            console.log(decodedJWTToken);
            db_logic.insertChildrenForID(client, decodedJWTToken["id"], data["ChildrenInfo"]["FirstName"], data["ChildrenInfo"]["LastName"], data["ChildrenInfo"]["Sex"], data["ChildrenInfo"]["Birthdate"])
            console.log(data["ChildrenInfo"]);
            client.release();
        }
        
    });
}

async function loadChildren(req, res)
{
    let body = '';
    req.on('data', (chunk) => 
    {
        body += chunk.toString();
    });

    req.on('end', async () =>
    {
        let data = JSON.parse(body);
        let decodedJWTToken = encryption_worker.decode(data);

        if(decodedJWTToken === false)
            {
                console.log("JWT couldn't be authentificated.");
                res.writeHead(200, {'Content-Type': 'application/json',});
                res.end(JSON.stringify({Response: 201, UserInfo: null}));
            }
            else
            {
                const client = await database.connect();
                console.log(decodedJWTToken["id"]);
                let childrenInfo = await db_logic.findChildrensByID(client, decodedJWTToken["id"]);
                console.log(childrenInfo);
                res.writeHead(200, {'Content-Type': 'application/json',});

                res.end(JSON.stringify({Response: 202, ChildrenInfo: childrenInfo}));
                client.release();
            }
        
    });
}

module.exports = {loadUser, loadChildren, insertChildren}
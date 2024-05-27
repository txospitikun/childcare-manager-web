var http = require('http');
var querystring = require('querystring');

const authentification_worker = require('./workers/auth_worker.js');
const user_worker = require('./workers/user_worker.js');

http.createServer((req, res) =>
{
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

    switch (req.method)
    {
        case 'POST':
            switch (req.url)
            {
                case '/register':
                    authentification_worker.handle_register(req, res);
                    break;
                case '/login':
                    authentification_worker.handle_login(req, res);
                    break;
                case '/load_user':
                    user_worker.loadUser(req, res);
                    break;
                case '/insert_children':
                    user_worker.insertChildren(req, res);
                    break;
                case '/load_children':
                    user_worker.loadChildren(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;

        case 'GET':
            switch(req.url)
            {

            }
            break;

        case 'PUT':
            switch(req.url)
            {

            }
            break;

        case 'DELETE':
            switch(req.url)
            {

            }
            break;
    }
}
).listen(5000);
console.log("Server has started!");



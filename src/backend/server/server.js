var http = require('http');
const url = require('url');
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
    const parsedUrl = url.parse(req.url, true);

    switch (req.method)
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
                case '/load_user':
                    user_worker.loadUser(req, res);
                    break;
                case '/insert_children':
                    user_worker.insertChildren(req, res);
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
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
        case 'PUT':
            switch(parsedUrl.pathname)
            {
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;

        case 'DELETE':
            switch(parsedUrl.pathname)
            {
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
    }
}
).listen(5000);
console.log("Server has started!");



var http = require('http');
var querystring = require('querystring');

const authentification_worker = require('./workers/auth_worker.js');

http.createServer((req, res) =>
{
    if(req.method === 'POST' && req.url === '/account_register')
    {
        authentification_worker.handle_register(req, res);
    }
    else
    if(req.method === 'POST' && req.url === '/account_login')
    {
        authentification_worker.handle_login(req, res);
    }
}).listen(5000);
console.log("Server has started!");



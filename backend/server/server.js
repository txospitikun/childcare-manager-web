var http = require('http');
var querystring = require('querystring');

http.createServer((req, res) =>
{
    if(req.method === 'POST' && req.url === '/account_register')
    {
        handle_register(req, res);
    }
}).listen(5000);



function handle_register(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log("Raw body:", body);
        let data = querystring.parse(body);
        console.log("Parsed data:", data);
    });
}
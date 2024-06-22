const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const {join} = require("path");
const {parse} = require("url");

const uploadDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

function serveStaticFiles(req, res) {
    const parsedUrl = url.parse(req.url);
    let pathname = path.join(__dirname, '..', '..', parsedUrl.pathname.replace('/api/', '')); // Adjust the path to correctly point to the uploads directory
    const ext = path.parse(pathname).ext || '.html';
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };

    fs.access(pathname, fs.constants.F_OK, (err) => {
        if (err) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        // if is a directory search for index file matching the extension
        if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

        // read file from file system
        fs.readFile(pathname, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extension and set the right content type
                res.setHeader('Content-type', map[ext] || 'text/plain');
                res.end(data);
            }
        });
    });
}

function handle_request(req) {
    return new Promise((resolve, reject) =>
    {
        let body = '';
        req.on('data', (chunk) =>
        {
            body += chunk.toString();
        });

        req.on('end', () =>
        {
            try
            {
                const parsedData = JSON.parse(body);
                resolve(parsedData);
            } catch (error)
            {
                reject(error);
            }
        });

        req.on('error', (error) =>
        {
            reject(error);
        });
    });
}

function serveStaticFiles(req, res) {
    const parsedUrl = parse(req.url);
    let pathname = path.join(__dirname, '..', '..', '..', '..', parsedUrl.pathname);
    const ext = path.parse(pathname).ext || '.html';
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };

    fs.access(pathname, fs.constants.F_OK, (err) => {
        if (err) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        // if is a directory search for index file matching the extension
        if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

        // read file from file system
        fs.readFile(pathname, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extension and set the right content type
                res.setHeader('Content-type', map[ext] || 'text/plain');
                res.end(data);
            }
        });
    });
}

function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const chunks = [];

        req.on('data', chunk => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const parts = buffer.toString('binary').split(`--${boundary}`);

            const fields = {};
            parts.forEach(part => {
                const matchContentDisposition = part.match(/Content-Disposition: form-data; name="([^"]+)"(; filename="([^"]+)")?/);
                if (matchContentDisposition) {
                    const key = matchContentDisposition[1];
                    const filename = matchContentDisposition[3];

                    if (filename) {
                        const fileDataStart = part.indexOf('\r\n\r\n') + 4;
                        const fileDataEnd = part.lastIndexOf('\r\n');
                        const fileContent = part.slice(fileDataStart, fileDataEnd);

                        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
                        const savedFilename = path.join('uploads', `${uniqueSuffix}-${filename}`);

                        const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }

                        fs.writeFileSync(path.join(uploadDir, `${uniqueSuffix}-${filename}`), fileContent, 'binary');
                        fields[key] = {
                            path: savedFilename.replace(/\\/g, '/'),
                            extension: path.extname(filename)
                        };
                    } else {
                        const value = part.slice(part.indexOf('\r\n\r\n') + 4, part.lastIndexOf('\r\n')).toString();
                        fields[key] = value;
                    }
                }
            });

            resolve(fields);
        });

        req.on('error', err => {
            reject(err);
        });
    });
}

module.exports = { handle_request, parseFormData, serveStaticFiles};
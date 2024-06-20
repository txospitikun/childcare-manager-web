const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const {join} = require("path");

const uploadDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
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
                        const savedFilename = path.join('src', 'uploads', `${uniqueSuffix}-${filename}`);

                        const uploadDir = path.join(__dirname, 'src', 'uploads');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }

                        fs.writeFileSync(path.join(__dirname, savedFilename), fileContent, 'binary');
                        fields[key] = savedFilename.replace(/\\/g, '/');
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
module.exports = { handle_request, parseFormData };
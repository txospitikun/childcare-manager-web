const crypto = require('crypto');

const key = 'd4e5f6a1b3c4d7e8f9a2b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6';

function encodeBase64(str) {
    return Buffer.from(str).toString('base64');
}

function decodeBase64(str) {
    return Buffer.from(str, 'base64').toString('utf-8');
}

function stringify(obj) {
    return JSON.stringify(obj);
}

function checkSumGen(head, body) {
    const checkSumStr = head + "." + body;
    const hash = crypto.createHmac('sha256', key);
    const checkSum = hash.update(checkSumStr).digest('base64');
    return checkSum;
}

function hash(text) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(text);
    return hmac.digest('hex');
}

const alg = { "alg": "HS256", "typ": "JWT" };

function encode(obj) {
    const currentDate = new Date().toISOString();
    obj.iat = currentDate;

    let result = "";
    const header = encodeBase64(stringify(alg));
    result += header + ".";
    const body = encodeBase64(stringify(obj));
    result += body + ".";
    const checkSum = checkSumGen(header, body);
    result += checkSum;
    return result;
}

function decode(str) {
    const jwtArr = str.split(".");
    const head = jwtArr[0];
    const body = jwtArr[1];
    const hash = jwtArr[2];
    const checkSum = checkSumGen(head, body);

    if (hash === checkSum) {
        const payload = JSON.parse(decodeBase64(body));

        const date = new Date(payload.iat);
        const time_difference = date - new Date();

        if(time_difference / (24 * 60 * 60 * 1000) > 5)
            return false;
        
        return {
            payload: payload,
        };
    } else {
        return false;
    }
}

module.exports = {
    encode,
    decode,
    hash
};

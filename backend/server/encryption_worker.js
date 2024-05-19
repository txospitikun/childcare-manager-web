var crypto = require('crypto');

module.exports = function(key) {
    this.key = key; 
    
    function encodeBase64(str) {
        return new Buffer.from(str).toString('base64').toString("utf-8");
    }

    function decodeBase64(str) {
        return new Buffer.from(str, 'base64').toString("utf-8");
    }
    
    function stringify(obj) {
        return JSON.stringify(obj);
    }

    function checkSumGen(head, body) {
        var checkSumStr = head + "." + body; 
        var hash = crypto.createHmac('sha256',key);
        var checkSum = hash.update(checkSumStr)
                .digest('base64').toString('utf8');
        return checkSum;
    }

    var alg = {"alg": "HS256", "typ": "JWT"};

    return {
        encode:(obj) => {
            var result = "";
            var header = encodeBase64(stringify(alg));
            // console.log(header);
            result += header + ".";
            var body = encodeBase64(stringify(obj));
            // console.log(body);
            result += body + ".";

            var checkSum = checkSumGen(header,body);
            result += checkSum; 
            return result;
        },
        decode:(str) => {
            var jwtArr = str.split("."); 
            var head = jwtArr[0];
            var body = jwtArr[1];
            var hash = jwtArr[2];
            var checkSum = checkSumGen(head,body); 

            if(hash === checkSum) {
                console.log("jwt hash: " + hash);
                console.log("gen hash: " + checkSum);
                console.log('JWT was authenticated');
                return JSON.parse(decodeBase64(body));
            } else {
                console.log('JWT was not authenticated');
                console.log("jwt hash: " + hash);
                console.log("gen hash: " + checkSum);
                return false;
            }
        }
    };
};
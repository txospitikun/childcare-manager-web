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

module.exports = { handle_request };
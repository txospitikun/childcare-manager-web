const database = require('./connection.js');


async function insertUser(client, email, password, fname, lname, privilege, suspended)
{
    const query = {
        text: 'INSERT INTO Users (Email, Password, FirstName, LastName, Privilege, Suspended) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [email, password, fname, lname, privilege, suspended]
    };
    const result = await client.query(query);
    return result;
};

async function findUserByID(client, ID) {
    try {
        const query = {
            text: 'SELECT * FROM Users WHERE ID = $1',
            values: [ID],
        };
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error; 
    }
}

async function findUserByEmail(client, email)
{
    try {
        const query = {
            text: 'SELECT * FROM Users WHERE Email = $1',
            values: [email],
        };
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error; 
    }
}

module.exports = { insertUser, findUserByID, findUserByEmail}
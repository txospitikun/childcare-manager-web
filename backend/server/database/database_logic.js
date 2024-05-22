const database = require('./connection.js');


async function insertUser(client, email, password, fname, lname, privilege, suspended)
{
    const query = {
        text: 'INSERT INTO Users (Email, Password, FirstName, LastName, Privilege, Suspended) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [email, password, fname, lname, privilege, suspended]
    };
    const result = await client.query(query);
    client.release();
    return result;
};

async function findUserByID(client, ID) {
    try {
        const client = await database.connect();
        const query = {
            text: 'SELECT * FROM Users WHERE ID = $1',
            values: [ID],
        };
        const result = await client.query(query);
        client.client();
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

async function insertChildrenForID(client, id, fname, lname, gender, birthdate)
{
    try
    {
        const query = {
            text: 'SELECT * FROM Users WHERE ID = $1',
            values: [id]
        };
        const result = await client.query(query);
        if(result.rows.length > 0)
        {
            const query = {
                text: 'INSERT INTO Childrens (FirstName, LastName, Gender, DateOfBirth, UserID) VALUES ($1, $2, $3, $4, $5)',
                values: [fname, lname, gender, birthdate, id],

            }
            console.log(query);
            const result_second = await client.query(query);
            return result_second;
        }
        return null;
    } catch(error)
    {
        console.log('Error inserting children for ID:', error);
        throw error;
    }
}

async function findChildrensByID(client, id)
{
    try
    {
        const query = {
            text: 'SELECT * FROM Childrens WHERE UserID = $1',
            values: [id],
        }
        const result = await client.query(query);
        return result.rows;
    } catch(error)
    {
        console.log('Error finding children for ID:', error);
        throw error;
    }
}

module.exports = { insertUser, findUserByID, findUserByEmail, findChildrensByID, insertChildrenForID}
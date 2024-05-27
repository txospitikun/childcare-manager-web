const pool = require('./../database/connection.js');
const Register = require('../request_modals/registerform_modal.js')

const encryption_worker = require('./../workers/encryption_worker.js');

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

module.exports = {findChildrensByID, insertChildrenForID}
const pool = require('./connection.js');


async function insertChildren(ID, childrenform) 
{
    try
    {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Childrens (FirstName, LastName, Gender, DateOfBirth, PictureRef, UserID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [childrenform.FirstName, childrenform.LastName, childrenform.Gender, childrenform.DateOfBirth, '0', ID]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function getAllChildren(ID) 
{
    
}

module.exports = {insertChildren, getAllChildren};
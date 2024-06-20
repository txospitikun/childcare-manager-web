const pool = require('./connection.js');


async function insertChildren(ID, childrenform) 
{
    try
    {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Childrens (FirstName, LastName, Gender, DateOfBirth, PictureRef, UserID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [childrenform.FirstName, childrenform.LastName, childrenform.Gender, childrenform.DateOfBirth, childrenform.PictureRef, ID]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function getChildrensByID(ID) 
{
    try 
    {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Childrens WHERE UserID = ?';
        const [result] = await connection.query(query, [ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error fetching children:', error);
        throw error;
    }
}

module.exports = {insertChildren, getChildrensByID};
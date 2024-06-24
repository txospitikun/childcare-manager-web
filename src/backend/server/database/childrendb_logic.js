const pool = require('./connection.js');


async function insertChildren(ID, childrenform) 
{
    try
    {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Childrens (FirstName, LastName, Gender, DateOfBirth, PictureRef, UserID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [childrenform.FirstName, childrenform.LastName, childrenform.Gender, childrenform.DateOfBirth, childrenform.PictureRef.path, ID]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function editChildren(entryID, childrenform, userID)
{
    try
    {
        const connection = await pool.getConnection();
        const query = 'UPDATE Childrens SET FirstName = ?, LastName = ?, Gender = ?, DateOfBirth = ?, PictureRef = ? WHERE ID = ? AND UserID = ?';
        const values= [childrenform.FirstName, childrenform.LastName, childrenform.Gender, childrenform.DateOfBirth, childrenform.PictureRef.path, entryID, userID];
        const [result] = await connection.query(query, values);
        connection.release();
        return result;
    } catch(error) {
        console.error('Error editing user:', error);
        throw error;
    }
}

async function deleteChildren(userID, childrenID)
{
    try
    {
        const connection = await pool.getConnection();
        const query_feeding = 'DELETE from feeding WHERE ChildrenID = ? AND UserID = ?';
        const query = 'DELETE FROM Childrens WHERE UserID = ? AND ID = ?';
        const [result_feeding] = await connection.query(query_feeding, [childrenID, userID]);
        const [result] = await connection.query(query, [userID, childrenID]);
        connection.release();
        return result;
    }
    catch (error) {
        console.error('Error deleting user:', error);
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

async function getAllChildren(ID)
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

module.exports = {insertChildren, editChildren, getChildrensByID, deleteChildren, getAllChildren};
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
function convertToDateString(isoString) {
    // Create a new Date object from the ISO string
    const date = new Date(isoString);

    // Extract the year, month, and day parts
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');

    // Return the formatted date string
    return `${year}-${month}-${day}`;
}
async function insertOrUpdateChild(ID, FirstName, LastName, Gender, DateOfBirth, PictureRef, UserID) {
    try {
        let dob = convertToDateString(DateOfBirth);
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO Childrens (ID, FirstName, LastName, Gender, DateOfBirth, PictureRef, UserID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                FirstName=VALUES(FirstName),
                LastName=VALUES(LastName),
                Gender=VALUES(Gender),
                DateOfBirth=VALUES(DateOfBirth),
                PictureRef=VALUES(PictureRef),
                UserID=VALUES(UserID)
        `;
        const [result] = await connection.query(query, [ID, FirstName, LastName, Gender, dob, PictureRef, UserID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting or updating child:', error);
        throw error;
    }
}

async function insertOrUpdateMedia(ID, ChildrenID, UserID, Date, Time, InTimeline, MediaType, PictureRef) {
    try {
        let dob = convertToDateString(Date);
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO Medias (ID, ChildrenID, UserID, Date, Time, InTimeline, MediaType, PictureRef)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                ChildrenID=VALUES(ChildrenID),
                UserID=VALUES(UserID),
                Date=VALUES(Date),
                Time=VALUES(Time),
                InTimeline=VALUES(InTimeline),
                MediaType=VALUES(MediaType),
                PictureRef=VALUES(PictureRef)
        `;
        const [result] = await connection.query(query, [ID, ChildrenID, UserID, dob, Time, InTimeline, MediaType, PictureRef]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting or updating media:', error);
        throw error;
    }
}

module.exports = {insertOrUpdateMedia, insertOrUpdateChild, insertChildren, getChildrensByID,editChildren, deleteChildren, getAllChildren};

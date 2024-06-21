const pool = require('./connection.js');


async function insertFeedingEntry(ID, feedingEntryForm)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Feeding (Date, Time, Unit, Quantity, FoodType, UserID, ChildrenID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [feedingEntryForm.Date, feedingEntryForm.Time, feedingEntryForm.Unit, feedingEntryForm.Quantity, feedingEntryForm.FoodType, ID, feedingEntryForm.ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting feeding entry:', error);
        throw error;
    }
}

async function getFeedingEntry(entryId, userID)
{
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Feeding WHERE ChildrenID = ? AND UserID = ?';
        console.log(entryId, userID);
        const [rows] = await connection.query(query, [entryId, userID]);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error getting feeding entry:', error);
        throw error;
    }
}
async function getFeedingEntriesByDate(date, userID, childID) {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Feeding WHERE Date = ? AND UserID = ? AND ChildrenID = ? ORDER BY Date ASC, Time ASC';
        console.log(date + " " + userID);
        const [rows] = await connection.query(query, [date, userID, childID]);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error getting feeding entries by date:', error);
        throw error;
    }
}

async function editFeedingEntry(entryId, feedingEntryForm, userID) {
    try {
        const connection = await pool.getConnection();
        const query = 'UPDATE Feeding SET Date = ?, Time = ?, Unit = ?, Quantity = ?, FoodType = ? WHERE ID = ? AND UserID = ?';
        const values = [feedingEntryForm.Date, feedingEntryForm.Time, feedingEntryForm.Unit, feedingEntryForm.Quantity, feedingEntryForm.FoodType, entryId, userID];
        const [result] = await connection.query(query, values);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error editing feeding entry:', error);
        throw error;
    }
}

async function deleteFeedingEntry(entryId, userID) {
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Feeding WHERE ID = ? AND UserID = ?';
        const [result] = await connection.query(query, [entryId, userID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error deleting feeding entry:', error);
        throw error;
    }
}

module.exports = { insertFeedingEntry, getFeedingEntry, editFeedingEntry, getFeedingEntriesByDate, deleteFeedingEntry};
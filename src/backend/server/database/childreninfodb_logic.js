const pool = require('./connection.js');


async function insertFeedingEntry(ID, feedingEntryForm)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Feeding (Date, Time, Unit, Quantity, UserID, ChildrenID) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [feedingEntryForm.Date, feedingEntryForm.Time, feedingEntryForm.Unit, feedingEntryForm.Quantity, ID, feedingEntryForm.SelectedChildren]);
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
async function getFeedingEntriesByDate(date, userID) {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Feeding WHERE Date = ? AND UserID = ?';
        const [rows] = await connection.query(query, [date, userID]);
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
        const query = 'UPDATE Feeding SET Date = ?, Time = ?, Unit = ?, Quantity = ?, FoodType = ?, ChildrenID = ? WHERE ID = ? AND UserID = ?';
        const values = [feedingEntryForm.Date, feedingEntryForm.Time, feedingEntryForm.Unit, feedingEntryForm.Quantity, feedingEntryForm.FoodType, feedingEntryForm.SelectedChildren, entryId, userID];
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
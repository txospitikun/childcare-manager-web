const pool = require('./connection.js');


async function insertFeedingEntry(ID, feedingEntryForm)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Feeding (Date, Time, Unit, Quantity, FoodType, UserID, ChildrenID) VALUES (?, ?, ?, ?, ?, ?, ?)';
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
        const query = 'SELECT * FROM Feeding WHERE ID = ? AND UserID = ?';
        const [rows] = await connection.query(query, [entryId, userID]);
        connection.release();
        return rows[0];
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


async function insertMedia(ID, photoForm)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Medias (Date, Time, PictureRef, UserID, InTimeline, MediaType, ChildrenID) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [photoForm.Date, photoForm.Time, photoForm.PictureRef.path, ID, photoForm.InTimeline, photoForm.PictureRef.extension, photoForm.ChildrenID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting photo:', error);
        throw error;
    }

}

async function insertSleepingEntry(ID, sleepingEntryForm){
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Sleeping (Date, SleepTime, AwakeTime, UserID, ChildrenID) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [sleepingEntryForm.Date, sleepingEntryForm.SleepTime, sleepingEntryForm.AwakeTime, ID, sleepingEntryForm.ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting sleeping entry:', error);
        throw error;
    }
}

async function getSleepingEntry(entryId, userID){
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Sleeping WHERE ID = ? AND UserID = ?';
        const [rows] = await connection.query(query, [entryId, userID]);
        connection.release();
        return rows[0];
    } catch (error) {
        console.error('Error getting sleeping entry:', error);
        throw error;
    }
}

async function getSleepingEntriesByDate(date, userID, childID) {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Sleeping WHERE Date = ? AND UserID = ? AND ChildrenID = ? ORDER BY Date ASC, SleepTime ASC';
        const [rows] = await connection.query(query, [date, userID, childID]);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error getting sleeping entries by date:', error);
        throw error;
    }
}

async function editSleepingEntry(entryId, sleepingEntryForm, userID) {
    try {
        const connection = await pool.getConnection();
        const query = 'UPDATE Sleeping SET Date = ?, SleepTime = ?, AwakeTime = ? WHERE ID = ? AND UserID = ?';
        const values = [sleepingEntryForm.Date, sleepingEntryForm.SleepTime, sleepingEntryForm.AwakeTime, entryId, userID];
        const [result] = await connection.query(query, values);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error editing sleeping entry:', error);
        throw error;
    }
}

async function deleteSleepingEntry(entryId, userID) {
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Sleeping WHERE ID = ? AND UserID = ?';
        const [result] = await connection.query(query, [entryId, userID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error deleting sleeping entry:', error);
        throw error;
    }
}

async function getChildrenMedia(ID, ChildrenID)
{
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Medias WHERE UserID = ? AND ChildrenID = ? ORDER BY Date DESC, Time DESC';
        const [rows] = await connection.query(query, [ID, ChildrenID]);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error getting children media:', error);
        throw error;
    }
}

async function deleteMedia(ID, mediaID)
{
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Medias WHERE ID = ? AND UserID = ?';
        const [result] = await connection.query(query, [mediaID, ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error deleting media:', error);
        throw error;
    }
}

async function insertHealth(ID, healthForm)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO Healthcare (ChildID, Date, TypeOf, Title, Description, FileRef, UserID) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [healthForm.ChildID, healthForm.Date, healthForm.TypeOf, healthForm.Title, healthForm.Description, healthForm.FileRef.path, ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting health entry:', error);
        throw error;
    }
}

async function getHealth(ID, ChildID, TypeOf)
{
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Healthcare WHERE UserID = ? AND ChildID = ? AND TypeOf = ? ORDER BY Date DESC';
        const [rows] = await connection.query(query, [ID, ChildID, TypeOf]);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error getting health entries:', error);
        throw error;
    }

}

async function deleteHealth(ID, healthID)
{
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Healthcare WHERE ID = ? AND UserID = ?';
        const [result] = await connection.query(query, [healthID, ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error deleting health entry:', error);
        throw error;
    }

}

module.exports = {deleteHealth, getHealth, insertHealth, getChildrenMedia, insertMedia, insertFeedingEntry, getFeedingEntry, editFeedingEntry, getFeedingEntriesByDate, deleteFeedingEntry, insertSleepingEntry, getSleepingEntry, getSleepingEntriesByDate, editSleepingEntry, deleteSleepingEntry,deleteMedia};


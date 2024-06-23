const pool = require('./connection.js');

async function insertGroup(ID, data)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO ChildrenGroups (UserID, Title, Creation_Date, PictureRef) VALUES (?, ?, ?, ?)';
        const [result] = await connection.query(query, [ID, data.Title, data.Creation_Date, data.PictureRef.path]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting group:', error);
        throw error;
    }

}

async function editGroup(ID, data)
{
    try {
        const connection = await pool.getConnection();
        const query = 'UPDATE ChildrenGroups SET Title = ?, Creation_Date = ?, PictureRef = ? WHERE ID = ? AND UserID = ?';
        const [result] = await connection.query(query, [data.Title, data.Creation_Date, data.PictureRef.path, data.ID, ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error editing group:', error);
        throw error;
    }

}

async function deleteGroup(ID, groupId)
{
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM ChildrenGroups WHERE ID = ? AND UserID = ?';
        const [result] = await connection.query(query, [groupId, ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }


}
async function getUserGroups(ID)
{
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT DISTINCT cg.*\n' +
            'FROM ChildrenGroups cg\n' +
            'LEFT JOIN GroupEntries ge ON cg.ID = ge.GroupID\n' +
            'LEFT JOIN Childrens c ON ge.ChildrenID = c.ID\n' +
            'WHERE cg.UserID = ?';
        const [result] = await connection.query(query, [ID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error getting group:', error);
        throw error;
    }


}
async function insertChildrenGroup(data)
{
    try {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO GroupEntries (GroupID, ChildrenID) VALUES (?, ?)';
        const [result] = await connection.query(query, [data.GroupID, data.ChildrenID]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error inserting children group:', error);
        throw error;
    }


}
async function deleteChildrenGroup(ID)
{

}

async function insertGroupRelation(ID, data)
{

}

async function editGroupRelation(ID, data)
{

}

async function deleteGroupRelation(ID)
{

}

async function insertGroupChat(ID, data)
{

}

async function deleteGroupChat(ID)
{

}

async function getGroupChat(ID)
{

}

module.exports = {
    insertGroup,
    editGroup,
    deleteGroup,
    getUserGroups,
    insertChildrenGroup,
    deleteChildrenGroup,
    insertGroupRelation,
    editGroupRelation,
    deleteGroupRelation,
    insertGroupChat,
    deleteGroupChat,
    getGroupChat
};
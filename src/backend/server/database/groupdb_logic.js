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
            'WHERE c.UserID = ? OR cg.UserID = ?;';
        const [result] = await connection.query(query, [ID, ID]);
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
async function deleteChildrenGroup(userId, groupId, childrenId) {
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM GroupEntries\n' +
            'WHERE ChildrenID = ?\n' +
            'AND GroupID = (\n' +
            '    SELECT GroupID FROM (\n' +
            '        SELECT ge.GroupID\n' +
            '        FROM GroupEntries ge\n' +
            '        JOIN ChildrenGroups cg ON ge.GroupID = cg.ID\n' +
            '        WHERE ge.GroupID = ? AND cg.UserID = ? AND ge.ChildrenID = ?\n' +
            '    ) AS subquery\n' +
            ');';
        const [result] = await connection.query(query, [childrenId, groupId, userId, childrenId]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error deleting children group:', error);
        throw error;
    }
}

async function getGroupChildrenInfo(userId, groupId)
{
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT c.ID, c.FirstName, c.LastName, c.PictureRef\n' +
            'FROM Childrens c\n' +
            'JOIN GroupEntries ge ON c.ID = ge.ChildrenID\n' +
            'WHERE ge.GroupID = ?';
        const [result] = await connection.query(query, [groupId]);
        return result;
    } catch (error)
    {
        console.error('Error getting group children info:', error);
        throw error;
    }
}

async function getGroupChildrenRelations(userId, childrenId, groupId)
{
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT *\n' +
            'FROM GroupRelations\n' +
            'WHERE ChildrenRelationOne = ? AND GroupID = ?';
        const [result] = await connection.query(query, [childrenId, groupId]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error getting group children relations:', error);
        throw error;
    }
}

    async function insertGroupRelation(data)
    {
        try {
            const connection = await pool.getConnection();
            const query = 'INSERT INTO GroupRelations (GroupID, ChildrenRelationOne, ChildrenRelationTwo, TypeOfRelation) VALUES (?, ?, ?, ?)';
            const [result] = await connection.query(query, [data.GroupID, data.ChildrenRelationOne, data.ChildrenRelationTwo, data.TypeOfRelation]);
            connection.release();
            return result;
        } catch (error) {
            console.error('Error inserting group relation:', error);
            throw error;
        }
    }
    async function editGroupRelation(ID, data) {

    }

    async function deleteGroupRelation(ID)
    {
        try {
            const connection = await pool.getConnection();
            const query = 'DELETE FROM GroupRelations WHERE ID = ?';
            const [result] = await connection.query(query, [ID]);
            connection.release();
            return result;
        } catch (error) {
            console.error('Error deleting group relation:', error);
            throw error;
        }
    }

    async function insertGroupChat(ID, data) {

    }

    async function deleteGroupChat(ID) {

    }

    async function getGroupChat(ID) {

    }

    module.exports = {
        getGroupChildrenInfo,
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
        getGroupChildrenRelations,
        getGroupChat
    };

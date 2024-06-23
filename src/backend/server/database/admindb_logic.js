const pool = require('./connection.js');


async function getAllUsers() {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Users';
        const [rows] = await connection.query(query);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
}
async function editUserParameter(data) {
    try {
        const connection = await pool.getConnection();

        const userId = data.ID;
        delete data.ID;

        if ('Suspended' in data) {
            const [rows] = await connection.query('SELECT Suspended FROM Users WHERE ID = ?', [userId]);

            if (rows.length === 0) {
                throw new Error('User not found');
            }

            data.Suspended = rows[0].Suspended === 0 ? 1 : 0;
        }

        const fields = Object.keys(data);
        const values = Object.values(data);

        const setClause = fields.map(field => `${field} = ?`).join(', ');

        const query = `UPDATE Users SET ${setClause} WHERE ID = ?`;
        values.push(userId);

        const [result] = await connection.query(query, values);
        connection.release();

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}


async function editChild(data) {
    try {
        const connection = await pool.getConnection();

        const childId = data.ID;
        delete data.ID;

        const fields = Object.keys(data);
        const values = Object.values(data);

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE Childrens SET ${setClause} WHERE ID = ?`;

        values.push(childId);
        const [result] = await connection.query(query, values);
        connection.release();

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating child:', error);
        throw error;
    }
}

async function deleteUser(userId)
{
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Users WHERE ID = ?';
        const [result] = await connection.query(query, [userId]);
        connection.release();
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

async function deleteChild(childId)
{
    try {
        const connection = await pool.getConnection();
        const query = 'DELETE FROM Childrens WHERE ID = ?';
        const [result] = await connection.query(query, [childId]);
        connection.release();
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting child:', error);
        throw error;
    }

}

module.exports = {deleteUser, deleteChild, editChild, getAllUsers, editUserParameter};
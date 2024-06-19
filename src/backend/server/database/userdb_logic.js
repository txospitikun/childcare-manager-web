const pool = require('./../database/connection.js');
const User = require('./../modals/user_modal.js')

const encryption_worker = require('./../workers/encryption_worker.js');


async function insertUser(registerform) {
    try {

        const encrypted_password = encryption_worker.hash(registerform.password);

        const connection = await pool.getConnection();
        const query = 'INSERT INTO Users (Email, Password, FirstName, LastName, Privilege, Suspended) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await connection.query(query, [registerform.email, encrypted_password, registerform.firstname, registerform.lastname, 0, 0]);
        const userId = result.insertId;
        const [rows] = await connection.query('SELECT * FROM Users WHERE ID = ?', [userId]);
        connection.release();
        return new User(rows[0]);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function findUserByID(ID) {
    try 
    {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Users WHERE ID = ?';
        const [result] = await connection.query(query, [ID]);
        const user = new User(result[0]);
        connection.release();
        return user;
    } 
    catch (error) 
    {
        console.error('Error finding user by ID:', error);
        throw error; 
    }
}

async function findUserByEmail(email) {
    try 
    {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM Users WHERE Email = ?';
        const [result] = await connection.query(query, [email]);

        if(result.length == 0)
            return null;

        connection.release();
        const user = new User(result[0]); 
        return user;
    } 
    catch (error) 
    {
        console.error('Error finding user by ID:', error);
        throw error; 
    }
}

module.exports = {findUserByID, findUserByEmail, insertUser}
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


async function editUser(updateaccount, userId) {
    try {
        const connection = await pool.getConnection();

        let query = 'UPDATE Users SET ';
        let fields = [];
        let values = [];

        if (updateaccount.email !== 'N/A' && updateaccount.email !== -1) {
            fields.push('Email = ?');
            values.push(updateaccount.email);
        }
        if (updateaccount.firstname !== 'N/A' && updateaccount.firstname !== -1) {
            fields.push('FirstName = ?');
            values.push(updateaccount.firstname);
        }
        if (updateaccount.lastname !== 'N/A' && updateaccount.lastname !== -1) {
            fields.push('LastName = ?');
            values.push(updateaccount.lastname);
        }
        if (updateaccount.phoneNo !== 'N/A' && updateaccount.phoneNo !== -1) {
            fields.push('PhoneNo = ?');
            values.push(updateaccount.phoneNo);
        }
        if (updateaccount.location !== 'N/A' && updateaccount.location !== -1) {
            fields.push('Location = ?');
            values.push(updateaccount.location);
        }
        if (updateaccount.language !== 'N/A' && updateaccount.language !== -1) {
            fields.push('Language = ?');
            values.push(updateaccount.language);
        }
        if (updateaccount.civilState !== 'N/A' && updateaccount.civilState !== -1) {
            fields.push('CivilState = ?');
            values.push(updateaccount.civilState);
        }
        if (updateaccount.civilPartner !== 'N/A' && updateaccount.civilPartner !== -1) {
            fields.push('CivilPartner = ?');
            values.push(updateaccount.civilPartner);
        }
        if (updateaccount.accountType !== 'N/A' && updateaccount.accountType !== -1) {
            fields.push('AccountType = ?');
            values.push(updateaccount.accountType);
        }
        if (updateaccount.pictureRef !== 'N/A' && updateaccount.pictureRef !== -1) {
            fields.push('PictureRef = ?');
            values.push(updateaccount.pictureRef.path);
        }

        if (fields.length === 0) {
            return;
        }

        query += fields.join(', ') + ' WHERE ID = ?';
        values.push(userId);

        const [result] = await connection.query(query, values);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function blacklistToken(token)
{
    try
    {
        const connection = await pool.getConnection();
        const query = 'INSERT INTO BlacklistedTokens (Token) VALUES (?)';
        const [result] = await connection.query(query, [token]);
        connection.release();
        return result;
    } catch (error) {
        console.error('Error blacklisting token:', error);
        throw error;
    }
}

async function isTokenBlacklisted(token)
{
    try
    {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM BlacklistedTokens WHERE Token = ?';
        const [result] = await connection.query(query, [token]);
        connection.release();
        return result.length > 0;
    } catch (error) {
        console.error('Error checking blacklisted token:', error);
        throw error;
    }
}

module.exports = {blacklistToken, isTokenBlacklisted, findUserByID, findUserByEmail, insertUser, editUser}
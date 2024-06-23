// database
var db_logic = require('../database/database_logic.js');
var userdb_logic = require('../database/userdb_logic.js');

// workers
const json_worker = require('./json_worker.js');
const fetch_worker = require('./fetch_worker.js');
const encryption_worker = require('./../workers/encryption_worker.js');

// modals
const Register = require('../request_modals/registerform_modal.js');
const Login = require('../request_modals/loginform_modal.js');

async function handle_register(req, res) 
{
    try
    {
        const parsedData = await fetch_worker.handle_request(req);
        const register = new Register(parsedData);
    
        if(register.password != register.confirm_password)
        {
            res.writeHead(401, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({ RegisterResponse: Register.response_password_mismatch }));
            return;
        }

        const searchedUser = await userdb_logic.findUserByEmail(register.email);
        if(searchedUser != null)
        {
            res.writeHead(401, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({ RegisterResponse: Register.response_user_already_exists }));
            return;
        }
        else
        {
            const registered_user = await userdb_logic.insertUser(register);
            
            const jwt_token = encryption_worker.encode({Email: registered_user.ID});

            res.writeHead(200, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({ RegisterResponse: Register.response_register_succesful, JWT: jwt_token}));
            return;
        }
    } 
    catch(err)
    {

        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({ RegisterResponse: Register.response_backend_error }));
    }
};


async function handle_login(req, res) 
{
    try
    {
        const parsedData = await fetch_worker.handle_request(req);
        const login = new Login(parsedData);
        const foundUser = await userdb_logic.findUserByEmail(login.email);


        if(foundUser === null)
        {
            res.writeHead(401, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({ LoginResponse: Login.response_user_or_password_not_valid }));
            return;
        }

        if(foundUser.Password != encryption_worker.hash(login.password))
        {
            res.writeHead(401, {'Content-Type': 'application/json',});
            res.end(JSON.stringify({ LoginResponse: Login.response_user_or_password_not_valid }));
            return;
        }

        const jwt_token = encryption_worker.encode({UserID: foundUser.ID});

        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({ LoginResponse: Login.response_login_succesful, JWT: jwt_token}));

    } 
    catch(err)
    {
        console.log("Server error: Couldn't login user! ", err);
        res.writeHead(500, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({ RegisterResponse: Register.response_backend_error }));
    }
};

module.exports = {handle_register, handle_login}
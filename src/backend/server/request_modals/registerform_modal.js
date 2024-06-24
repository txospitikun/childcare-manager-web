class Register
{
    static response_register_succesful  = 100;
    static response_user_already_exists = 101;
    static response_password_mismatch   = 102;


    static response_backend_error = 1;

    constructor(json)
    {
        this.firstname = json.firstname;
        this.lastname = json.lastname;
        this.email = json.email;
        this.password = json.password;
        this.confirm_password = json.confirm_password;
    }
}

module.exports = Register;
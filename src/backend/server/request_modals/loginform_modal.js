class Login
{
    static response_login_succesful  = 200;
    static response_user_or_password_not_valid = 201;

    static response_backend_error = 1;

    constructor(json)
    {
        this.email = json.email;
        this.password = json.password;
    }
}

module.exports = Login;
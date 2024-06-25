class UpdateAccount {
    static response_update_successful = 300;
    static response_user_not_found = 301;
    static response_invalid_data = 302;

    static response_backend_error = 1;

    constructor(json) {
        this.email = json.email;
        this.password = json.password;
        this.firstname = json.firstname;
        this.lastname = json.lastname;
        this.phoneNo = json.phoneNo;
        this.location = json.location;
        this.language = json.language;
        this.civilState = json.civilState;
        this.civilPartner = json.civilPartner;
        this.accountType = json.accountType;
        this.pictureRef = json.pictureRef;
    }
}

module.exports = UpdateAccount;
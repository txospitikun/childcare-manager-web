class User
{
    constructor(json)
    {
        this.ID = json.ID;
        this.Email = json.Email;
        this.Password = json.Password;
        this.RegisterDate = json.RegisterDate;
        this.Privilege = json.Privilege;
        this.Suspended = json.Suspended;
        this.FirstName = json.FirstName;
        this.LastName = json.LastName;
        this.PhoneNo = json.PhoneNo;
        this.Location = json.Location;
        this.Language = json.Language;
        this.CivilState = json.CivilState;
        this.CivilPartner = json.CivilPartner;
        this.AccountType = json.AccountType;
        this.PictureRef = json.PictureRef;
    }
}

module.exports = User;
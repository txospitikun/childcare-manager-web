class Children
{
    constructor(json)
    {
        this.ID = json.ID;
        this.FirstName = json.FirstName;
        this.LastName = json.LastName;
        this.Gender = json.Gender;
        this.DateOfBirth = json.DateOfBirth;
        this.PictureRef = json.PictureRef;
        this.UserID = json.UserID;
    }
}

module.exports = Children;
class ChildrenForm
{

    static response_children_added_succesfully = 300;
    static response_invalid_form_data = 301;
    static response_invalid_auth = 10;

    static response_backend_error = 1;


    constructor(json)
    {
        this.FirstName = json.FirstName;
        this.LastName = json.LastName;
        this.Gender = json.Gender;
        this.DateOfBirth = json.DateOfBirth;
        this.PictureRef = json.PictureRef;
    }
}

module.exports = ChildrenForm;
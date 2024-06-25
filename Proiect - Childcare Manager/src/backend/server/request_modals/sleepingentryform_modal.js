class SleepingEntryForm{
    
    static response_sleeping_entry_added_sucessfully = 300;
    static response_invalid_form_data = 301;
    static response_invalid_auth = 10;

    static response_backend_error = 1;

    constructor(json){
        this.ID = json.ID;
        this.Date = json.Date;
        this.SleepTime = json.SleepTime;
        this.AwakeTime = json.AwakeTime;
    }
}

module.exports = SleepingEntryForm;
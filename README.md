# childcare-manager-web


# RESTAPI

# POSTS
/api/register
```
Payload:
{
    "firstname":"Dennis",
    "lastname":"Nita",
    "email":"abcdef12@gmail.com",
    "password":"123",
    "confirm_password":"123"
}

Response:
(User registered succesfully - Status: 200)
{
    "RegisterResponse": 100,
    "JWT": "eyJ... (the token is longer and should be saved as cookie) ...ppkJCyjU="
}

(Email already exists - Status: 401)
{
    "RegisterResponse": 101
}

(Password mismatch - Status: 401)
{
    "RegisterResponse": 102
}
```

/api/login
```
Payload:
{
    {
    "email":"dennis@hotmail.com",
    "password":"parolamea"
}

Response:
(User authentificated sucessfully - Status: 200)
{
    "LoginResponse": 200,
    "JWT": "eyJ... (the token is longer and should be saved as cookie) ...ppkJCyjU="
}

(User not found or password wrong - Status: 401)
{
    "LoginResponse": 201
}
```
/api/insert_children
```
Payload: (JWT token as cookie)
{
    "FirstName":"Luca",
    "LastName":"Cozloschi",
    "Gender":"Male",
    "DateOfBirth":"2003-03-02"
}
(JWT Token is expired or invalid. Should redirect to login page - Status: 401)
{
    "InsertChildrenResponse": 10
}

(Children succesfully added. Status: 200)
{
    "InsertChildrenResponse": 300
}
```
#GETS

/api/get_children // JWT token as cookie
```
Payload: JWT as header
Response: --- STATUS 200
{
    "Response": 200,
    "ChildrenInfo": [
        {
            "ID": 16,
            "FirstName": "Luca",
            "LastName": "Cozloschi",
            "Gender": "Male",
            "DateOfBirth": "2003-03-01T22:00:00.000Z",
            "PictureRef": "not implemented",
            "UserID": 15
        },
        {
            "ID": 17,
            "FirstName": "Marian",
            "LastName": "Ciotir",
            "Gender": "Male",
            "DateOfBirth": "2003-03-01T22:00:00.000Z",
            "PictureRef": "not implemented",
            "UserID": 15
        }
    ]
}

Response: 401 - INVALID AUTHENTIFICATION --- STATUS 401
Response: 404 - NO CHILDREN FOUND        --- STATUS 404

```
/api/get_feeding_entries_by_date?date=2024-06-18 // JWT token as cookie
```
Response: --- STATUS 200
[
    {
        "ID": 10,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 11,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    }
]

GetFeedingEntryResponse: 301 - invalid entry id  --- STATUS: 400
GetFeedingEntryResponse: 404 - no entries found  --- STATUS: 404
GetFeedingEntryResponse: 1 - for backend errors  --- STATUS: 505
```
api/get_feeding_entry?id=1 // id is child's id // JWT token as cookie
```
Response: --- STATUS 200
[
    {
        "ID": 10,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 11,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 12,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    },
    {
        "ID": 13,
        "Date": "2024-06-17T21:00:00.000Z",
        "Time": "15:00:00",
        "Unit": "mg",
        "Quantity": 1500,
        "FoodType": null,
        "UserID": 15,
        "ChildrenID": 1
    }
]

GetFeedingEntryResponse: 301 - invalid entry id  --- STATUS: 400
GetFeedingEntryResponse: 404 - no entries found  --- STATUS: 404
GetFeedingEntryResponse: 1 - for backend errors  --- STATUS: 505
```
# PUTS
/api/edit_feeding_entry
```
Payload:
{
    "ID": 9,
    "SelectedChildren": 1,
    "Date": "2023-03-11",
    "Time": "14:00:00",
    "Unit": "ml",
    "Quantity": 2000,
    "FoodType": "Milk"
}

Response:

EditFeedingEntryResponse: 404 if no entries affected
EditFeedingEntryResponse: 300 if edited sucesfully 

```

# DELETE
/api/delete_feeding_entry?id=9

# SQL Tabels:
```

CREATE TABLE ChildrenGroups (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Creation_Date DATE NOT NULL,
    PictureRef VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

CREATE TABLE GroupEntries (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    GroupID INT NOT NULL,
    ChildrenID INT NOT NULL,
    FOREIGN KEY (ChildrenID) REFERENCES Childrens(ID),
    FOREIGN KEY (GroupID) REFERENCES ChildrenGroups(ID),
    UNIQUE (GroupID, ChildrenID)
);


CREATE TABLE GroupRelations (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    GroupID INT NOT NULL,
    ChildrenRelationOne INT NOT NULL,
    ChildrenRelationTwo INT NOT NULL,
    TypeOfRelation VARCHAR(255),
    FOREIGN KEY (ChildrenRelationOne) REFERENCES Childrens(ID),
    FOREIGN KEY (ChildrenRelationTwo) REFERENCES Childrens(ID),
    FOREIGN KEY (GroupID) REFERENCES ChildrenGroups(ID)
);

CREATE TABLE GroupChat (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    GroupID INT NOT NULL,
    Message TEXT NOT NULL,
    UserID INT NOT NULL,
    Message_Date DATE NOT NULL,
    Message_Time TIME NOT NULL,
    FOREIGN KEY (GroupID) REFERENCES ChildrenGroups(ID),
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);


CREATE TABLE Sleeping (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE,
    SleepTime TIME,
    AwakeTime TIME,
    UserID INT,
    ChildrenID INT,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (ChildrenID) REFERENCES Childrens(ID)
);

CREATE TABLE medias (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ChildrenID INT NOT NULL,
    UserID INT NOT NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    InTimeline TINYINT(1) NOT NULL,
    MediaType VARCHAR(255) NOT NULL,
    PictureRef VARCHAR(255) NOT NULL
    FOREIGN KEY (ChildrenID) REFERENCES Childrens(ID),
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

CREATE TABLE Healthcare (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    ChildID INT NOT NULL,
    Date DATE NOT NULL,
    TypeOf INT NOT NULL,
    Title TEXT NOT NULL,
    Description TEXT,
    FileRef VARCHAR(255)
);

CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RegisterDate DATE,
    Privilege INT,
    Suspended TINYINT(1),
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    PhoneNo VARCHAR(20),
    Location VARCHAR(255),
    Language VARCHAR(255),
    CivilState TINYINT(1),
    CivilPartner INT,
    AccountType INT,
    PictureRef VARCHAR(255)
);

CREATE TABLE Childrens (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Gender VARCHAR(255),
    DateOfBirth DATE,
    PictureRef VARCHAR(255),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

CREATE TABLE Feeding (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE,
    Time TIME,
    Unit VARCHAR(50),
    Quantity INT,
    FoodType VARCHAR(100),
    UserID INT,
    ChildrenID INT,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (ChildrenID) REFERENCES Children(ID)
);

CREATE TABLE Photos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ChildrenID INT,
    UserID INT,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    InTimeline BOOLEAN NOT NULL,
    PictureRef VARCHAR(255) NOT NULL,
    FOREIGN KEY (ChildrenID) REFERENCES Childrens(ID),
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);


CREATE TABLE Relations (
    ID BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    First INT,
    Second INT,
    RelationType INT
);
```


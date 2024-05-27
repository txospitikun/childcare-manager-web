# childcare-manager-web


# RESTAPI

# POSTS
/api/register
```
Payload:
{
    "name":"dennis",
    "prename":"alexandru",
    "email":"dennis@hotmail.com",
    "password":"parolamea",
    "confirm_password":"parolamea"
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
Payload:
{
    "JWT": "eyJ... (the token is longer and should be saved as cookie) ...ppkJCyjU="
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

# SQL Tabels:
Users:
```
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RegisterDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    Privilege INT NOT NULL,
    Suspended BOOLEAN NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    PhoneNo VARCHAR(20),
    Location VARCHAR(255),
    Language VARCHAR(255),
    CivilState BOOLEAN,
    CivilPartner INT,
    AccountType INT,
    PictureRef VARCHAR(255)
);

```
Children:
```
CREATE TABLE Childrens (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Gender VARCHAR(255) NOT NULL,
    DateOfBirth DATE NOT NULL,
    PictureRef VARCHAR(255),
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

```
Relations:
```
CREATE TABLE Relations (
    ID SERIAL PRIMARY KEY,
    First INT NOT NULL,
    SECOND INT NOT NULL,
    RelationType INT NOT NULL
);
```


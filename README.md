# childcare-manager-web

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

# REST API COSTUM COMMUNICATION CODES:
```
Register:
#100 -> inregistrare cu succes
#101 -> parolele nu coincid
#102 -> exista deja un cont cu acest id
#103 -> parola este prea scurta

Login:
#110 -> logare cu succes
#111 -> parola/email incorecta
#112 -> contul este suspendat
#113 -> contul nu are adresa de email verificata

UserHandle:
#200 -> Succesful JWT Authentification
#201 -> Failed JWT Authentification

#0 -> succes
#1 -> eroare necunoscuta
```

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
(User registered succesfully)
{
    "RegisterResponse": 100,
    "JWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6ImQxMjQxMjQyMTI0MmUyMm5uaXNAaGFsZmZsdXguY29tIiwiaWF0IjoiMjAyNC0wNS0yN1QyMDowNTo1OS44MDBaIn0=.i0GvYhd7Xv+G8DBHM+5fAh1rBaDHJCN6gaHppkJCyjU="
}

(Email already exists)
{
    "RegisterResponse": 101
}

(Password mismatch)
{
    "RegisterResponse": 102
}
```

/api/login
```
```


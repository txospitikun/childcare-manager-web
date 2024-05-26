# childcare-manager-web

# SQL Tabels:
Users:
```
CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    Email VARCHAR NOT NULL,
    Password VARCHAR NOT NULL,
    RegisterDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Privilege INT NOT NULL,
    Suspended BOOLEAN NOT NULL,
    FirstName VARCHAR NOT NULL,
    LastName VARCHAR NOT NULL,
    PhoneNo VARCHAR,
    Location VARCHAR,
    Language VARCHAR,
    CivilState BOOL,
    CivilPartner INT,
    AccountType INT,
    PictureRef VARCHAR
);
```
Children:
```
CREATE TABLE Childrens (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR NOT NULL,
    LastName VARCHAR NOT NULL,
    Gender VARCHAR NOT NULL,
    DateOfBirth DATE NOT NULL,
    PictureRef VARCHAR,
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


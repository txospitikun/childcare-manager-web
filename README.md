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


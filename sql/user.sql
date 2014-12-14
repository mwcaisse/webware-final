CREATE TABLE USER (
    USER_ID BIGINT NOT NULL AUTO_INCREMENT,
    USER_NAME VARCHAR(100) NOT NULL,
    USEr_ROLE VARCHAR(100) NOT NULL,
    PRIMARY KEY (USER_ID)
);

INSERT INTO USER (USER_NAME, USER_ROLE)
VALUE ('Mitchell', 'Developer'),
      ('Zac', 'Developer'),
      ('Dale', 'Developer'),
      ('Trevor', 'Developer');
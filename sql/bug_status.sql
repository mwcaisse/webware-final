CREATE TABLE BUG_STATUS (
    BUG_STATUS_ID BIGINT NOT NULL AUTO_INCREMENT,
    BUG_STATUS VARCHAR(100),
    PRIMARY KEY (BUG_STATUS)
);

INSERT INTO BUG_STATUS (BUG_STATUS)

    VALUES ('New'),
           ('Assigned'),
           ('Completed'),
           ('Not a Bug'),
           ('QA Testing');
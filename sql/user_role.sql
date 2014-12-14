CREATE TABLE USER_ROLE (
    USER_ROLE VARCHAR(100) NOT NULL,
    PRIMARY KEY (USER_ROLE)
);

INSERT INTO USER_ROLE (USER_ROLE)
    VALUES  ('User'),
            ('Customer'),
            ('Product Owner'),
            ('Manager'),
            ('Developer');
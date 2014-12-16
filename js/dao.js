var util = require("util");
var Client = require('mariasql');
var inspect = require('util').inspect;

/** The dao object */
var dao = new Object();

/** Creates a connection to the database
 *
 * @return The created client object
 */
dao.connect = function() {
    var client = new Client();

    client.connect({
        host: "localhost",
        user: "mwcaisse",
        password: "mwcaisse_pw",
        db: "mwcaisse_db"
    });

    return client;
};

/** Helper function for executing a simple sql SELECT
 *
 * @param queryString The query string to execute
 * @param onFinished The function to call when finished, returns an array containing the results
 * @param queryParams The parameters to the query
 */
dao.fetchDataString = function(queryString, onFinished, queryParams) {
    var conn = dao.connect();

    var myOnFinished = function(results)  {
        conn.end();
        onFinished(results);
    };

    conn.on("connect", function() {
        dao.fetchDataStringConn(conn, queryString, myOnFinished, queryParams);
    });

    conn.on("error", function() {
        console.log("Error connecting to database");
    });

};

/** Helper function for executing a simple sql SELECT
 *
 * @param conn The connection to use for executing the select
 * @param queryString The query string to execute
 * @param onFinished The function to call when finished, returns an array containing the results
 * @param queryParams The parameters to the query
 */
dao.fetchDataStringConn = function(conn, queryString, onFinished, queryParams) {
    var query;
    if (queryParams) {
        query = conn.query(queryString, queryParams);
    }
    else {
        query = conn.query(queryString);
    }

    var results = [];
    var ind = 0;

    query.on("result", function (res) {
        res.on("row", function (row) {
            results[ind++] = row;
        })
    });

    //when the query
    query.on("end", function () {
        if (onFinished) {
            onFinished(results);
        }
    });
};

/** Fetches a single element from the database
 *
 * @param queryString The query string to execute
 * @param onFinished The function to call when finished, returns an array containing the results
 * @param queryParams The parameters to the query
 */
dao.fetchSingleElementString = function(queryString, onFinished, queryParams) {
    var myFinished = function(elements) {
        if (elements.length > 0) {
            onFinished(elements[0]);
        }
        else {
            onFinished({});
        }
    };

    dao.fetchDataString(queryString, myFinished, queryParams);

};

//SELECT LAST_INSERT_ID() as id;

/** Exexcutes the specified insert command
 *
 * @param queryString The query string for the insert
 * @param queryParams The query params for the insert
 * @param onFinished The function to call when it is finished, with true / false as a parameter. True meaning successful
 */
dao.insertData = function(queryString, queryParams, onFinished) {
    var conn = dao.connect();

    conn.on("connect", function() {

        var query;
        if (queryParams) {
            query = conn.query(queryString, queryParams);
        }
        else {
            query = conn.query(queryString);
        }

        //when the query finishes successfully
        query.on("end", function () {

            dao.selectLastId(conn, function(id) {
                conn.end();
                onFinished(id);
            });

        });

        //query finished with errors
        query.on("error", function() {
            conn.end();
            if (onFinished) {
                onFinished(false);
            }
        });
    });

    //connection finished with errors
    conn.on("error", function() {
        console.log("Error connecting to database");
        if (onFinished) {
            onFinished(false);
        }
    });
};

/** Selects the last ID inserted into the database on the specified connection
 *
 * @param conn The connection to use
 * @param onFinished The function to call with the id when finished, or false if no id
 */
dao.selectLastId = function(conn, onFinished) {
    var selectIdQuery = "SELECT LAST_INSERT_ID() as id";

    //when the select id is finished
    var onSelectFinished = function(data) {
        if (onFinished) {
            if (data.length > 0) {
                var id = data[0].id;
                onFinished(id);
            }
            else {
                onFinished(false);
            }
        }
    };

    dao.fetchDataStringConn(conn, selectIdQuery, onSelectFinished);
};


/** Exexcutes the specified update command
 *
 * @param queryString The query string for the update
 * @param queryParams The query params for the update
 * @param onFinished The function to call when it is finished, with true / false if successful/unsuccessful
 */
dao.updateData = function(queryString, queryParams, onFinished) {
    var conn = dao.connect();

    conn.on("connect", function() {

        var query;
        if (queryParams) {
            query = conn.query(queryString, queryParams);
        }
        else {
            query = conn.query(queryString);
        }

        var results = [];
        var ind = 0;

        //when the query finishes successfully
        query.on("end", function () {

            if (onFinished) {
                onFinished(true);
            }
        });

        //query finished with errors
        query.on("error", function() {
            conn.end();
            if (onFinished) {
                onFinished(false);
            }
        });
    });

    //connection finished with errors
    conn.on("error", function() {
        console.log("Error connecting to database");
        if (onFinished) {
            onFinished(false);
        }
    });
};

/** Export the functions / object */
module.exports = dao;

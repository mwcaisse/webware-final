
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

        query.on("result", function (res) {
            res.on("row", function (row) {
                results[ind++] = row;
            })
        });

        //when the query
        query.on("end", function () {
            conn.end();
            if (onFinished) {
                onFinished(results);
            }
        });
    });

    conn.on("error", function() {
        console.log("Error connecting to database");
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

        var results = [];
        var ind = 0;

        //when the query finishes successfully
        query.on("end", function () {
            conn.end();
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

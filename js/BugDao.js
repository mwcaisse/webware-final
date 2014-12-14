
var dao = require('dao');

var bugDAO = new Object();

/** Fetches all bugs
 *
 * @param onFinished The function to call with the data when finished
 */
bugDAO.fetchAllBugs = function(onFinished) {
    var queryString = "SELECT BUG_ID AS id," +
                             "BUG_PRIORITY AS priority," +
                             "BUG_CREATE_DATE AS dateCreated," +
                             "BUG_UPDATE_DATE AS dateUpdated," +
                            "BUG_STATUS AS status," +
                            "BUG_AUTHOR AS author," +
                            "BUG_DESCRIPTION AS description," +
                            "BUG_ASSIGNED AS assigned" +
                            "FROM BUG";
    var queryParams = {};

    dao.fetchDataString(queryString, queryParams, onFinished);
};

/** Fetches the bug with the specified id
 *
 * @param bugId the Id of the bug to fetch
 * @param onFinished The function to call with the data when finished
 */
bugDAO.fetchBugById = function(bugId, onFinished) {
    var queryString = "SELECT BUG_ID AS id," +
        "BUG_PRIORITY AS priority," +
        "BUG_CREATE_DATE AS dateCreated," +
        "BUG_UPDATE_DATE AS dateUpdated," +
        "BUG_STATUS AS status," +
        "BUG_AUTHOR AS author," +
        "BUG_DESCRIPTION AS description," +
        "BUG_ASSIGNED AS assigned" +
        "FROM BUG WHERE BUG_ID = (:bugId)";

    var queryParams = {bugId: bugId};

    dao.fetchDataString(queryString, queryParams, onFinished);
};

/** Export the functions / object */
module.exports = dao;
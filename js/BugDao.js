
var dao = require('../js/dao');

var bugDAO = new Object();

/** Fetches all bugs
 *
 * @param onFinished The function to call with the data when finished
 */
bugDAO.fetchAllBugs = function(onFinished) {
    var queryString = "SELECT BUG_ID as id, " +
        "BUG_PRIORITY as priority, " +
        "BUG_CREATE_DATE as createDate, " +
        "BUG_STATUS as status, " +
        "user_author.USER_NAME as author, " +
        "BUG_DESCRIPTION as description, " +
        "user_assigned.USER_NAME as assigned FROM BUG " +
        "LEFT JOIN USER AS user_assigned ON BUG_ASSIGNED = user_assigned.USER_ID " +
        "LEFT JOIN USER AS user_author ON BUG_AUTHOR = user_author.USER_ID";

    dao.fetchDataString(queryString, onFinished);
};

/** Fetches the bug with the specified id
 *
 * @param bugId the Id of the bug to fetch
 * @param onFinished The function to call with the data when finished
 */
bugDAO.fetchBugById = function(bugId, onFinished) {
    var queryString = "SELECT BUG_ID as id, " +
        "BUG_PRIORITY as priority, " +
        "BUG_CREATE_DATE as createDate, " +
        "BUG_STATUS as status, " +
        "user_author.USER_NAME as author, " +
        "BUG_DESCRIPTION as description, " +
        "user_assigned.USER_NAME as assigned FROM BUG " +
        "LEFT JOIN USER AS user_assigned ON BUG_ASSIGNED = user_assigned.USER_ID " +
        "LEFT JOIN USER AS user_author ON BUG_AUTHOR = user_author.USER_ID " +
        "WHERE BUG_ID = (:bugId)";

    var queryParams = {bugId: bugId};

    var myOnFinished = function(results) {
        if (results.length > 0) {
            onFinished(results[0])
        }
        else {
            onFinished({}); //no results returned
        }
    }

    dao.fetchDataString(queryString, myOnFinished, queryParams);
};

/** Export the functions / object */
module.exports = bugDAO;
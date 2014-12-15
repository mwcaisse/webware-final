
var dao = require('../js/dao');

var commentDAO = new Object();

/** Fetches all the comments for the bug with the specified id
 *
 * @param bugId The id of the bug to fetch
 * @param onFinished The function to call with the results when finished
 */
commentDAO.fetchCommentsForBug = function(bugId, onFinished) {
    var queryString = "SELECT COMMENT_ID as id, " +
        "COMMENT_BUG as bugId, " +
        "COMMENT_AUTHOR as author, " +
        "COMMENT_BODY as body, " +
        "COMMENT_CREATE_DATE as createDate FROM COMMENT " +
        "LEFT JOIN USER AS user_author ON COMMENT_AUTHOR = user_author.USER_ID " +
        "WHERE COMMENT_BUG = (:bugId)";

    var queryParams = {bugId: bugId};

    dao.fetchDataString(queryString, onFinished, queryParams);
};

module.exports = commentDAO;
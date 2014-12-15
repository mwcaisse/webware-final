
var dao = require('../js/dao');
var userDAO = require('../js/UserDao');

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

/** Creates the specified comment
 *
 * @param comment The comment to create
 * @param onFinished The function to call when update is finished, with true or false indicating success / failure
 */
commentDAO.createComment = function(comment, onFinished) {
    commentDAO.addUserIdToComment(comment, function(newComment) {
        //bug should have all users as ids now, perform a create
        var queryString = "INSERT INTO COMMENT (COMMENT_BUG, COMMENT_AUTHOR, COMMENT_BODY) " +
                "VALUES (:bugId, :author, :body)";

        var queryParams = comment;

        dao.insertData(queryString, queryParams, onFinished);
    });
};


/** Converts the Author tag in the comment into the user's id
 *
 * @param comment The comment to convert the user on
 * @param onFinished The function to call with the updated comment when finished
 */

commentDAO.addUserIdToComment = function(comment, onFinished) {
    userDAO.fetchUserByName(comment.author, function (comment_author) {
        comment.author = comment_author.id;
        onFinished(comment);
    });
};

module.exports = commentDAO;
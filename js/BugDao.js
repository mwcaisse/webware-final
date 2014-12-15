
var dao = require('../js/dao');
var commentDAO = require('../js/CommentDao');
var userDAO = require('../js/UserDao');

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

    var myOnFinished = function(bug) {
        if (bug.id) {
            //append the comments onto this bug
            commentDAO.fetchCommentsForBug(bugId, function(bugComments) {
                bug.comments = bugComments;
                onFinished(bug);
            });
        }
        else {
            onFinished({}); //no results returned
        }
    };

    dao.fetchSingleElementString(queryString, myOnFinished, queryParams);
};

/** Creates the specified bug
 *
 * @param bug The bug to create
 * @param onFinished The function to call when update is finished, with true or false indicating success / failure
 */
bugDAO.createBug = function(bug, onFinished) {
    bugDAO.addUserIdToBug(bug, function(newBug) {
        //bug should have all users as ids now, perform a create
        var queryString = "INSERT INTO BUG (BUG_TITLE, BUG_PRIORITY, BUG_STATUS, BUG_AUTHOR, BUG_DESCRIPTION, BUG_ASSIGNED) " +
                "VALUES (:title, :priority, :status, :author, :description, :assigned)";

        var queryParams = bug;

        dao.insertData(queryString, queryParams, onFinished);
    });
};


/** Updates the specified bug
 *
 * @param bug The bug to update
 * @param onFinished The function to call when update is finished, with true or false indicating success / failure
 */
bugDAO.updateBug = function(bug, onFinished) {
    bugDAO.addUserIdToBug(bug, function(newBug) {
        //bug should have all users as ids now, perform a create
        var queryString = "UPDATE BUG " +
            "SET BUG_TITLE = :title, " +
            "BUG_PRIORITY = :priority, " +
            "BUG_STATUS = :status, " +
            "BUG_AUTHOR = :author, " +
            "BUG_DESCRIPTION = :description, " +
            "BUG_ASSIGNED = :assigned " +
            "WHERE BUG_ID = :id";

        var queryParams = bug;

        dao.insertData(queryString, queryParams, onFinished);
    });
};

dao.insertGameReview = function(game, score, company, onFinished) {
    dao.insertData("INSERT INTO mwcaisse_db.GAME_REVIEW (GAME, SCORE, COMPANY)" +
        "VALUES (:game, :score, :company)", {game: game, score: score, company: company},
        onFinished);
};

/** Converts the Author and Assign user names into user ids
 *
 * @param bug The bug to perform the conversion on
 * @param onFinished The function that will be called when finished, with a reference to the bug
 */

bugDAO.addUserIdToBug = function(bug, onFinished) {
    userDAO.fetchUserByName(bug.author, function (user_author) {
        bug.author = user_author.id;
        userDAO.fetchUserByName(bug.assigned, function (user_assigned) {
            bug.assigned = user_assigned.id;
            onFinished(bug);
        });
    });
};





/** Export the functions / object */
module.exports = bugDAO;
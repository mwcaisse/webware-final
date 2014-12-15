
var dao = require('../js/dao');


var userDAO = new Object();

/** Fetches all users in the database
 *
 * @param onFinished The function to call with the results when finished
 */
userDAO.fetchAllUsers = function(onFinished) {
    var queryString = "SELECT USER_ID as id, " +
                    "USER_NAME as name, " +
                    "USER_ROLE as role FROM USER";


    dao.fetchDataString(queryString, onFinished);
};

/** Fetches the user with the specified id
 *
 * @param userId The id of the user to fetch
 * @param onFinished THe method to call with the results when finished
 */
userDAO.fetchUserById = function(userId, onFinished) {
    var queryString = "SELECT USER_ID as id, " +
        "USER_NAME as name, " +
        "USER_ROLE as role FROM USER " +
        "WHERE USER_ID = (:userId)";

    var queryParams = {userId: userId};

    dao.fetchSingleElementString(queryString, onFinished, queryParams);

}


module.exports = userDAO;
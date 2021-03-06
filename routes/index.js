var express = require('express');
var router = express.Router();

var util = require("util");
var bugDAO = require('../js/BugDao');
var commentDAO = require('../js/CommentDao');
var userDAO = require('../js/UserDao');

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/index.html');
});

/* GET home page. */
router.get('/index.html', function(req, res) {
    res.render('terbyte', { title: 'TerByte', message: 'A Team Plasma Innovation', comments:{} });
});

router.get("/buglist.html", function(req, res) {
    bugDAO.fetchAllBugs(function (results) {
        res.render("buglist", {bugs: results});
    });
});

/* GET graph page. */
router.get('/graph', function(req, res) {
    res.render('graph', {} );
});

/* retrieve bug listing */
router.get('/bug/all', function(req, res) {
    bugDAO.fetchAllBugs(function (results) {
        res.json(results);
    });
});

/* create a bug */
router.get('/view/create-bug', function(req, res) {
    userDAO.fetchAllUsers(function (results) {
        res.render('bug-detail', {
            id: -1,
            title: '',
            priority: 'Low',
            status: 'New',
            author: '',
            description: '',
            assigned: '',
            comments: [],
            users: results
        });
    });
});

/* retrieve bug by id */
router.get('/view/bug/:id', function(req, res) {
    var bugId = req.params.id;
    bugDAO.fetchBugById(bugId, function(bug) {
        userDAO.fetchAllUsers(function (users) {
            bug.users = users;
            res.render('bug-detail', bug);
        });
    });
});

/* retrieve user listing */
router.get('/user/all', function(req, res) {
    userDAO.fetchAllUsers(function (results) {
       res.json(results);
    });
});

/* retrieve user by id */
router.get('/user/id/:id', function(req, res) {
    var userId = req.params.id;
    userDAO.fetchUserById(userId, function (results) {
        res.json(results);
    });
});

/* create a new bug */
router.post('/bug/create', function(req, res) {
    var bug = req.body;
    bugDAO.createBug(bug, function(id) {
       res.json(id);
    });
});

/* update a bug */
router.post('/bug/update', function(req, res) {
    var bug = req.body;
    bugDAO.updateBug(bug, function(success) {
        res.json(success);
    });
});

/* create a comment */
router.post('/comment/create', function(req, res) {
    var comment = req.body;
    commentDAO.createComment(comment, function(id) {
        res.json(id);
    });
});

/* get all comments */
router.get('/comment/pull/:id', function(req, res) {
    var id = req.params.id;
    commentDAO.fetchCommentsForBug(id, function(data) {
        userDAO.fetchAllUsers(function (results) {
            data.users = results;
            res.render("comments", {comments: data});
        });
    });
});

module.exports = router;

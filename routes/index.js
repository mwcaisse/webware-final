var express = require('express');
var router = express.Router();

var bugDAO = require('../js/BugDao');
var commentDAO = require('../js/CommentDao');
var userDAO = require('../js/UserDao');

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/index.html');
});

/* GET home page. */
router.get('/index.html', function(req, res) {
    res.render('terbyte', { title: 'TerByte', message: 'A Team Plasma Innovation' });
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

/* retrieve bug by id */
router.get('/bug/id/:id', function(req, res) {
    var bugId = req.params.id;
    bugDAO.fetchBugById(bugId, function(results) {
        res.json(results);
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
    bugDAO.createBug(bug, function(success) {
       res.json(success);
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
router.post('/comment', function() {
    
});

/* retrieve info for piechart */
router.get('/chart', function() {
    bugDAO.fetchAllBugs(function(results) {
        res.json(results);
    });
});

module.exports = router;

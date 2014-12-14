var express = require('express');
var router = express.Router();

var bugDAO = require('../js/BugDao');

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/index.html');
});

/* GET home page. */
router.get('/index.html', function(req, res) {
    res.render('terbyte', { title: 'TerByte', message: 'A Team Plasma Innovation' });
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
router.get('/user/all', function() {
    
});

/* retrieve user by id */
router.get('/user/id/:id', function() {
    
});

/* create a new bug */
router.post('/bug/create', function() {
    
});

/* update a bug */
router.post('/bug/update', function() {
    
});

/* create a comment */
router.post('/comment', function() {
    
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/terbyte.html', function(req, res) {
  res.render('terbyte', { title: 'TerByte', message: 'A Team Plasma Innovation' });
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    /* Google Map Screen*/
    res.render(__dirname + '../views/initial/initial', { title: 'bad' });
});

router.get('/sharemap/*', function(req, res, next) {
    res.render(__dirname + '../views/index/index', { title: '' });
});

module.exports = router;

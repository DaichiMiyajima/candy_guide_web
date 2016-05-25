var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    /* Google Map Screen*/
    res.render('initial', { title: 'bad' });
});

router.get('/sharemap/*', function(req, res, next) {
    console.log("sharemap");
    res.render('index', { title: '' });
});

module.exports = router;

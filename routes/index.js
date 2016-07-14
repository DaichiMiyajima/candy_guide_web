var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*', function(req, res, next) {
    /* Google Map Screen*/
    res.render('../views/candy', { title: '' });
});

router.get('/sharemap/*', function(req, res, next) {
    res.render('../views/candy', { title: '' });
});

module.exports = router;

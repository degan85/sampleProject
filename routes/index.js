var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Degan!!' });
  res.render('original_animate');
});
router.get('/mico/:id', function(req, res) {
    // req.session.aaa = req.params.id;
    res.render('original_animate',
        { id : req.params.id }
    );
});
module.exports = router;

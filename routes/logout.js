var express = require('express');

var router = express.Router();

// Logout and redirect
router.get('/', function(req, res, next){
  req.session.destroy(function(){
  	console.log('Je bent weer uitgelogd');
    res.redirect('/');
  });
});

module.exports = router;
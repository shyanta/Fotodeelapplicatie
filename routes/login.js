var express = require('express');

var router = express.Router();

// Show the login form
router.get('/', function(req, res, next) {
  res.locals.req = req;
  res.render('admin/login');
});

// Handle authentication posted from the form (no checks at all)
router.post('/', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  

  req.getConnection(function(err, connection){
    connection.query('SELECT * FROM users WHERE name=? AND password=?', [username, password], function(err, result){
      if(result[0]){
        req.session.ingelogd = true;
        req.session.admin = true;
        req.session.username = req.body.username;

        console.log('Goede inloggegevens');
        res.redirect('./content');
      }
      else{
       console.log('Foute inloggegevens');
       res.render('admin/login_wrong');
      }
    }); 
  });

  /*if(username == 'Shyanta' && password == 'vleugel'){
    req.session.ingelogd = true;
    req.session.admin = true;
    req.session.username = 'Shyanta';
    console.log('goed');
    res.redirect('./content');
  }
  else{
  	console.log('fout');
  	res.redirect(req.get('referer'));
  }
  // ...*/
});

module.exports = router;
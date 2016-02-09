var express = require('express');
var multer = require('multer');
var session = require('express-session');
var MyConnection = require('express-myconnection');
var fs = require('fs');

var router = express.Router();

var upload = multer({dest: 'public/uploads/'});

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session.ingelogd = true){
  	console.log('Ingelogd');
    return next();
	}
  else{
    console.log('Niet ingelogd');
    res.redirect('/login');
	}
};

router.get('/', auth, function(req, res){
	
	res.render('admin/upload');
});



router.post('/', auth, upload.single('file'), function(req, res){

	var username = req.session.username;
	console.log(username);

	req.getConnection(function(err, connection) {

		connection.query('SELECT id FROM users WHERE name=?', [username], function(err, result){
			//console.log(result[0].id);
			fs.rename(
				req.file.path,
				req.file.destination + req.file.originalname
				);
			var data = {
			user_id: result[0],
			filename: req.file.originalname
		}
			console.log(data);
			connection.query('INSERT INTO photos SET ?',[data], function(err, result){
				console.log(result);
				res.redirect('/content');
			})
		});
	});

	
});

module.exports = router;
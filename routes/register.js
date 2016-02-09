var express = require('express');

var router = express.Router();


router.get('/', function(req, res){
	res.render('admin/register');
});

router.post('/', function(req, res){
	req.getConnection(function(err, connection) {
		var data = {
			name: req.body.username,
			email: req.body.email,
			password: req.body.password
		}
		console.log(data);
		connection.query('INSERT INTO users SET ?',[data], function(err, result){
			console.log(result);
		});
	});
	res.redirect('/login');
	
});

module.exports = router;

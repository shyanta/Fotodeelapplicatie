//Modules
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var	multer = require('multer');
var fs = require('fs');
	mysql = require('mysql'),
	MyConnection = require('express-myconnection');

// Upload map voor multer
var upload = multer({dest: 'public/uploads/'});

//Routers
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var contentRouter = require('./routes/content');
var uploadRouter = require('./routes/upload');
var registerRouter = require('./routes/register');
var commentRouter = require('./routes/comment');

var app = express();


// Connect met MySQL
app.use(MyConnection(mysql, {
  host: 'localhost',
  user: 'student',
  password: 'serverSide',
  port: 3306,
  database: 'student'
}, 'single'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "geheime-code",
  saveUninitialized: true,
  resave: false
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Tell express which static files to serve
app.use(express.static('public')); 


app.get('/', function(req, res){
  req.getConnection(function(err, connection) {
    connection.query('SELECT * FROM photos', function(err, result){
      console.log(result);
      res.locals.fotos=result;
      res.locals.user = req.session.username;
      res.render('index')
    });
  });
});


app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/content', contentRouter);
app.use('/upload', uploadRouter);
app.use('/register', registerRouter);
app.use('/photo', contentRouter);

app.get('/*', function(req,res){
  res.render('404');
})

app.listen(3000, function(){
	console.log('De app is gestart');
});
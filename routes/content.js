var express = require('express');

var router = express.Router();

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session.ingelogd){
  	console.log('Ingelogd');
    return next();
	}
  else{
    console.log('Niet ingelogd');
    res.redirect('/login');
	}
};

// Get content endpoint
router.get('/', auth, function(req, res) {
	
  req.getConnection(function(err, connection) {
    connection.query('SELECT * FROM photos', function(err, result){
      //console.log(result);
      res.locals.fotos=result;
      res.locals.user = req.session.username;
      res.render('content');
    });
  });
});

// Fotopagina inladen
router.get("/:index", function(req,res,next){
  var photo = req.params.index;
  req.getConnection(function(err, connection) {
    connection.query('SELECT * FROM photos WHERE filename=?', [photo], function(error, result){ 
      
      var photoID = result[0].id;                               
          
      connection.query('SELECT comment FROM comments WHERE photo_id=?', [photoID], function(error, result){ 
          res.locals.comment = result;
      }); 

      connection.query('SELECT * FROM photos WHERE caption=?', [photo], function(err, result){
        //console.log(result);
        res.locals.fotos = result;
        res.locals.photo = photo;
        res.render('photo');
      });
    });
  });
});

router.post('/:index', function (req, res, next){
    var photo = req.params.index;                                         
      req.getConnection(function(error, connection){                   

        connection.query('SELECT * FROM photos WHERE filename=?', [photo], function(error, result){
              var photoID = result[0].id
           
              var data = {
                photo_id: photoID,                                      
                comment: req.body.comment,                              
            }

            connection.query('INSERT INTO comments SET ?', [data], function(error, result){
                res.redirect(req.get('referer'));
            });
        });
    });
});


module.exports = router;

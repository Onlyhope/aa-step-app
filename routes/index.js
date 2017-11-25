var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('pages/index', { 
  							title: "Express",
  							author: "Aaron Lee"
  						});
});

router.get('/profile/:name', function(req, res, next) {
	res.send("<h2> User's name is " + req.params.name + "</h2>");
});

router.post('/file-upload', function(req, res, next) {
	var form = new formidable.IncomingForm();
	var upload_dir = path.join(__dirname, "../uploads/");

	form.parse(req, function(err, fields, files) {
		var oldpath = files.filetoupload.path;
		var newpath = upload_dir + files.filetoupload.name;
		fs.rename(oldpath, newpath, function(err) {
			if (err) throw err;
			res.write('File uploaded and moved!');
			res.end();
		});
	});
});



module.exports = router;

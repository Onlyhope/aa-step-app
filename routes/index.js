var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
	var list_of_users = [
		{ username: "Aaron Lee", password: "123", age: 5 },
		{ username: "Benjamin Lee", password: "456", age: 10 },
		{ username: "Chris Lee", password: "789", age: 15 }
	]

  	res.render('pages/index', { 
  							title: "Express",
  							author: "Aaron Lee",
  							userList: list_of_users
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

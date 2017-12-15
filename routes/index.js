var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var csv = require('csvtojson');

var upload_dir = path.join(__dirname, "../uploads/");

/* GET home page. */
router.get('/', function(req, res, next) {
	var list_of_users = [
		{ username: "Aaron Lee", password: "123", age: 5 },
		{ username: "Benjamin Lee", password: "456", age: 10 },
		{ username: "Chris Lee", password: "789", age: 15 }
	];

	var list_of_files = [];
	fs.readdirSync(upload_dir).forEach(function(file) {
		list_of_files.push(file);
	});

  	res.render('pages/index', { 
  							title: "Express",
  							author: "Aaron Lee",
  							userList: list_of_users,
  							fileList: list_of_files
  						});
});

router.get('/file-display/:file_name', function(req, res, next) {
	var file_path = upload_dir + req.params.file_name;

	var transactions = [];

	csv()
	.fromFile(file_path)
	.on('json',(jsonObj)=>{
		console.log(jsonObj.Amount);
		console.log(jsonObj.Description);
		console.log(jsonObj.PostDate);
		transactions.push(jsonObj);
    	// combine csv header row and csv line to a json object
    	// jsonObj.a ==> 1 or 4
	}).on('done', (error) => {
		console.log(transactions.length);

		fs.readFile(file_path, (err, data) => {
			if (err) throw err;
			res.render('pages/file-display', {
											fileName : req.params.file_name,
											transactionList : transactions
										});
		});
	});
});

router.get('/profile/:name', function(req, res, next) {
	res.send("<h2> User's name is " + req.params.name + "</h2>");
});

router.post('/file-upload', function(req, res, next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var oldpath = files.filetoupload.path;

		var transactions = [];

		csv()
		.fromFile(oldpath)
		.on('json', (jsonObj) => {
			console.log(jsonObj["Post Date"]);
			console.log("\nTransaction: ", jsonObj);
			transactions.push(jsonObj);
		}).on('done', (error) => {
			// Save transctions into database here..
		});
	});
});

module.exports = router;

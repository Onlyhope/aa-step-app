var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var csv = require('csvtojson');
var mongodb = require('mongodb');

var upload_dir = path.join(__dirname, "../uploads/");

/* GET home page. */
router.get('/', function(req, res, next) {
	var renderHomePage = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('transactions');

		collection.find({}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else {
				res.render('pages/index', {
					title: "Express",
					author: "Aaron Lee",
					transList : result
				});
			}
		});
	};

	operateDatabase(renderHomePage);
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
			var MongoClient = mongodb.MongoClient;
			var url = 'mongodb://localhost:27017/aa_users';

			MongoClient.connect(url, function(err, db) {
				if (err) {
					console.log('Connection to MongoDB failed...', err);
				} else {
					var userDB = db.db('aa_users');
					var collection = userDB.collection('transactions');

					collection.insert(transactions, function(err, result) {
						if (err) {
							res.send('Error', err);
						} else {
						res.redirect('/');
						}
					});
				}
			});
		});
	});
});

var operateDatabase = function (action) {
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Connection to MongoDB failed...', err);
		} else {
			console.log('Connection successful! Performing action...');
			action(db);
			db.close();
		}
	});
};

module.exports = router;

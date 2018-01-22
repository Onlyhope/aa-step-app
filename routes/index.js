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
			db.close();
		});
	};

	operateDatabase(renderHomePage); 	
});

router.post('/file-upload', function(req, res, next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		var oldpath = files.filetoupload.path;

		var transactions = [];

		csv()
		.fromFile(oldpath)
		.on('json', (jsonObj) => {

			var params = jsonObj['Posting Date'].split("/");
			var post_date = new Date(parseInt(params[2]), parseInt(params[0])-1, parseInt(params[1]));

			var transaction = {
				details: jsonObj['Details'],
				date: post_date,
				description: jsonObj['Description'],
				amount: jsonObj['Amount']
			}
			transactions.push(transaction);
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
						db.close();
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
		}
	});
};

module.exports = router;

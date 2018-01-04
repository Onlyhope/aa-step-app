var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var renderTransactionPage = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('transactions');

		collection.find({}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				res.render('pages/transactions-display', {
					title: "Transactions",
					transList: result
				});
			} else {
				res.send("No transactions found");
			}
		});

	}

	operateDatabase(renderTransactionPage);
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
var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

function getTotalSpent(items) {
	var total = 0;

	for (var i = 0; i < items.length; i++) {
		if (items[i]['amount'].charAt(0) === '-') {
			// It's a sale
			total -= parseFloat(items[i]['amount'].substring(1));
		} else {
			// It's a payment - Do nothing
		}
	}

	return total;
}

function getNetAmount(items) {
	var net = 0;

	for (var i = 0; i < items.length; i++) {
		if (items[i]['amount'].charAt(0) === '-') {
			// It's a sale
			net -= parseFloat(items[i]['amount'].substring(1));
		} else {
			net += parseFloat(items[i]['amount']);
		}
	}

	return net;
}

// Binary Sort? Because it's in place sorting?
function sortByMonths(items) {
	var transByMonthList = [];

	for (var i = 0; i < items.length; i++) {



		transByMonthList.push(transByMonth);
	}
}

router.get('/', function(req, res, next) {
	var renderTransactionPage = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('transactions');

		collection.find({}).sort({date: -1}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				var total_spent = getTotalSpent(result);
				var net_gain = getNetAmount(result);

				res.render('pages/transactions-display', {
					title: "Transactions",
					transList: result,
					totalSpent: total_spent.toFixed(2),
					netGain: net_gain.toFixed(2)
				});
			} else {
				res.send("No transactions found");
			}
			db.close();
		});

	}

	operateDatabase(renderTransactionPage);
});

router.get('/search/:keywords', function(req, res, next) {
	var renderSearch = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('transactions');

		collection.find({}).sort({date: -1}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				var keywords = req.params.keywords.split(" ");
				var filteredList = [];
				for (var i = 0; i < result.length; i++) {
					for (var j = 0; j < keywords.length; j++) {
						if (result[i]['description'].includes(keywords[j])) {
							filteredList.push(result[i]);
							break;
						}
					}
				}

				var total_spent = getTotalSpent(filteredList);
				var net_gain = getNetAmount(filteredList);

				res.render('pages/transactions-display', {
					title: "Filtered Transactions " + req.params.keywords,
					transList: filteredList,
					totalSpent: total_spent.toFixed(2),
					netGain: net_gain.toFixed(2)
					});
			} else {
				res.send('No transactions found');
			}
			db.close();
		});
	}

	operateDatabase(renderSearch);
});

router.get('/detail/:trans_id', function(req, res, next) {
	res.send("Transaction ID: " + req.params.trans_id);
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
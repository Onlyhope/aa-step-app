var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

function getTotalSpent(items) {
	var total = 0;

	for (var i = 0; i < items.length; i++) {
		if (items[i]['Amount'].charAt(0) === '-') {
			// It's a sale
			total -= parseFloat(items[i]['Amount'].substring(1));
			console.log(items[i]['Type']);
		} else if (items[i]['Amount'].charAt(0) === '+') {
			// It's a payment - Do nothing
		}
	}

	return total;
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

		collection.find({}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				var total_spent = getTotalSpent(result);

				res.render('pages/transactions-display', {
					title: "Transactions",
					transList: result,
					totalSpent: total_spent.toFixed(2)
				});
			} else {
				res.send("No transactions found");
			}
			db.close();
		});

	}

	operateDatabase(renderTransactionPage);
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
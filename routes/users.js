var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/display', function(req, res, next) {

	var MongoClient = mongodb.MongoClient;

	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Connection to MongoDB failed...', err);
		} else {
			console.log('Connection to MongoDB success!', url);
			// Get the correct collection
			var collection = db.collection('aa_users');
			// Get all users
			collection.find({}).toArray(function (err, result) {
				if (err) {
					res.send(err);
				} else if (result.length) {
					res.render('pages/users-display', {
						title : "Users",
						userList : result
					});
				} else {
					res.send('No users / documents found');
				}
				// Close Connection
				db.close();
			});
		}
	});
});

module.exports = router;

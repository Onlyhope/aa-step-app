var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/display', function(req, res, next) {

	var MongoClient = mongodb.MongoClient;
	// aa_users indicate the db name
	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Connection to MongoDB failed...', err);
		} else {
			console.log('Connection to MongoDB success!', url);
			// Get the correct collection - aa_users 
			var collection = db.collection('aa_users');
			// Get all users
			collection.find({}).toArray(function (err, result) {
				if (err) {
					res.send(err);
				} else if (result.length) {
					res.render('pages/users-display', {
						title : "User Display",
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

router.get('/:username', function(req, res, next) {
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Connection to MongoDB failed', err);
		} else {
			// Get the collection from the db
			var collection = db.collection('aa_users');
			// Retrieve user object from collection
			collection.find({
				username : req.params.username
			}).toArray(function(err, result) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					var users = result;
					res.render('pages/user-update', {
						title : "Update User Info:",
						user : users[0]
					});
				}
			});
		}

		db.close();
	});
});

router.post('/:username/update-user', function(req, res, next) {
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		// Get the collection from the db
		var collection = db.collection('aa_users');
		// Retrieve user object from collection
		collection.updateOne(
			{ username : req.params.username },
			{ 	username : req.body.username,
				password : req.body.password,
				name : req.body.name,
				email : req.body.email },
			function(err, result) {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					console.log('Success!');
					res.redirect('/users/' + req.params.username);
				}
		});

		db.close()
	});
});

router.post('/:username/delete-user', function(req, res, next) {
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		// Get the collection from the db
		var collection = db.collection('aa_users');
		// Delete the user from the database
		collection.deleteOne({
			username: req.params.username
		}, function (err, result) {
			if (err) {
				console.log("Deletion failed!");
				res.send(err);
			} else {
				console.log("Success!");
				res.redirect('/users/display');
			}
		});

		db.close();
	});
})

router.post('/new-user', function(req, res, next) {
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/aa_users';

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Connection to MongoDB failed...', err);
		} else {
			// Get the collection from the db
			var collection = db.collection('aa_users');

			// Retrieve data from HTTP request body
			var user = {
				username: req.body.username,
				password: req.body.password,
				name: req.body.name,
				email: req.body.email,
				js_input: "HACKED"
			};

			// Insert new user into the database
			collection.insert([user], function (err, result) {
				if (err) {
					console.log(err);
					res.redirect('display');
				} else {
					console.log("Inserted: ", user);
					res.redirect('display');
				}
			});

			db.close();
		}
	});
});

module.exports = router;

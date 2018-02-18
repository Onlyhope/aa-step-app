var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/display', function(req, res, next) {
	var displayUsers = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('users');

		collection.find({}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else if (result.length) {
				res.render('pages/users-display', {
					title: "User Display",
					userList: result
				});
			} else {
				res.send("No users found");
			}
			db.close();
		});
	};

	operateDatabase(displayUsers);
});

router.get('/:username', function(req, res, next) {
	var getUserInfo = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('users');

		collection.find({
			username : req.params.username
		}).toArray(function(err, result) {
			if (err) {
				res.send(err);
			} else {
				var users = result;
				res.render('pages/user-update', {
					title: "Update User Info",
					user: users[0]
				});
			}
			db.close();
		});
	};

	operateDatabase(getUserInfo);
});

router.post('/:username/update-user', function(req, res, next) {
	var updateUser = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('users');

		collection.updateOne(
			{ username: req.params.username},
			{ username: req.body.username,
			  password: req.body.password,
			  name: req.body.name,
			  email: req.body.email},
			function(err, result) {
				if (err) {
					res.send(err);
				} else {
					res.redirect('/users/' + req.params.username);
				}
				db.close();
			});
	};

	operateDatabase(updateUser);
});

router.post('/:username/delete-user', function(req, res, next) {
	var deleteUser = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('users');

		collection.deleteOne({
			username: req.params.username
		},
		function (err, result) {
			if (err) {
				res.send(err);
			} else {
				res.redirect('/users/display');
			}
			db.close();
		});
	};

	operateDatabase(deleteUser);
});

router.post('/new-user', function(req, res, next) {	
	var createUser = function(db) {
		var userDB = db.db('aa_users');
		var collection = userDB.collection('users');

		var user = {
			username: req.body.username,
			password: req.body.password,
			name: req.body.name,
			email: req.body.email
		};

		collection.insert([user], function(err, result) {
			if (err) {
				res.send(err);
			} else {
				res.redirect('display');
			}
			db.close();
		});
	};

	operateDatabase(createUser);
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

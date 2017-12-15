var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csv = require('csv');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('pages/error');
});

/* CSV Parsing */
require('should');

var output = [];
// Create the parser
var parser = csv.parse({delimiter: ':'});
// Use the writable stream api
parser.on('readable', function() {
	while (record = parser.read()) {
		console.log(record);
		output.push(record);
	}
});

// Catch any error
parser.on('error', function(err) {
	console.log(err.message);
});
// When we are done, test that he parsed output matched what expected
parser.on('finish', function(){
  	output.should.eql([
    	[ 'root','x','0','0','root','/root','/bin/bash' ],
    	[ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]
  	]);
});

// Create MongoDB Client
var MongoClient = require('mongodb').MongoClient;

url = 'mongodb://localhost:27017/aa-step-app';

MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	console.log("Connected correctly to server");
    db.db('aa_users').createCollection('users', function(err, res) {
      if (err)
        console.log('Collection not created');
      else
        console.log('Collection "users" created!');
    })

    db.close();
});

// Now that setup is done, write data to the stream
parser.write("root:x:0:0:root:/root:/bin/bash\n");
parser.write("someone:x:1022:1022:a funny cat:/home/someone:/bin/bash\n");
// Close the readable stream
parser.end();

module.exports = app;

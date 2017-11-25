// set variables for environment
var express = require('express');
var path = require('path');

var app = express();

// views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// set routes
app.get('/', function(req, res) {
  	res.render('pages/index', { 
  							title: "Express",
  							author: "Aaron Lee"
  						});
});


// Set server port
app.listen(3000);
console.log('server is running');
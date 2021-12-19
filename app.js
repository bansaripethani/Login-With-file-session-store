var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'student_db'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended : true}));
//app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
                 
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			
		});
	} else {
		response.send('Please enter Username and Password!');
		
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!' + ` <a href='/logout'>click to logout</a>`);
        
	} else {
		///response.send('Please login to view this page!');
		response.redirect('/login.html');
	}
});

app.get('/logout',(req,res) => {
	if(request.session.loggedin){
		if(request.session)
		{
			req.session.destroy();
			res.redirect('/');	
		}
	}
         
});

app.listen(8000);   
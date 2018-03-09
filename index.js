// eslint no-param-reassign: ["error", { "props": false }]
// eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]


'use strict';

const PORT=8080;
// for some reason you still need to type MONGO_URL in at command line
const MONGO_URL="mongodb://tgp22:account1@ds161493.mlab.com:61493/tp-todo-hmwk";
const SESSION_SECRET='4261Ln9MplIzXiOaHFZFq7Zq+1/Ksji3Xa+cs09uu8g=';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
const app = express();
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Users = require('./models/users.js');
const Tasks = require('./models/tasks.js');

// Configure our app
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});
 app.engine('handlebars', exphbs({
    defaultLayout: 'main',
 }));
 app.set('view engine', 'handlebars');
// if pug // app.engine('pug', exphbs({
// if pug //   defaultLayout: 'main',
// if pug // }));
// if pug // app.set('view engine', 'pug');

// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure session middleware that will parse the cookies
// of an incoming request to see if there is a session for this cookie.
app.use(session({
    secret: process.env.SESSION_SECRET || 'super secret session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto',
    },
    store,
}));

// Middleware that looks up the current user for this sesssion, if there
// is one.
app.use((req, res, next) => {
    if (req.session.userId) {
        Users.findById(req.session.userId, (err, user) => {
            if (!err) {
                res.locals.currentUser = user;
            }
            next();
        });
    } else {
        next();
    }
});

/**
 * Middleware that checks if a user is logged in.
 * If so, the request continues to be processed, otherwise a
 * 403 is returned.
 * @param  {Request} req - The request
 * @param  {Response} res - sdf
 * @param  {Function} next - sdfs
 * @returns {undefined}
 */

function isLoggedIn(req, res, next) {
    if (res.locals.currentUser) {
        next();
    } else {
	  res.send("Bro, you're not logged in :-(");
    }
}

/**
 * Middleware that loads a users tasks if they are logged in.
 * @param  {Request} req - An express request object
 * @param  {Response} res - An express response object
 * @param  {Callback} next - Called when the function is done
 * @returns {undefined}
 */
function loadUserTasks(req, res, next) {
    // Removed
    next();
}

// Return the home page after loading tasks for users, or not.
app.get('/', loadUserTasks, (req, res) => {
    res.render('index');
});

app.post('/users/register', (req, res) => {
	if (req.body.password==req.body.passwordConfirmation) {
		var userName=req.body.name;
		var userEmail=req.body.email;
		var password=req.body.password;
		var hash = bcrypt.hashSync(password, salt);
        Users.create({
                name: userName,
                email: userEmail,
                hashed_password: hash
        });
//        function (err, users_instance) {
//        if (err) res.send('Error');	
	console.log(userName+userEmail+hash);
	res.redirect('/');
	} else {
		res.send("Passwords do not match");
	}
});

// I was making real progress, but...
//  it's 10:50pm and i need to leave at 6:00am for a flight to
//  South Africa
//  I wish I had gotten this to work

app.post('/users/login', (req, res) => {
	var userEmail=req.body.email;
        var password=req.body.password;
        var hash = bcrypt.hashSync(password, salt);
	Users.find({ 'email': userEmail },
	function (err, users) {if (err) res.send('email does not exist');

	if(users.email==undefined){
		console.log('no match')
	} else {
		console.log('match!')
	};
	
})});

// Log a user out
app.get('/users/logout', (req, res) => {
    res.send('woot');
});

//  All the controllers and routes below this require
//  the user to be logged in.
app.use(isLoggedIn);

// Handle submission of new task form
app.post('/tasks/:id/:action(complete|incomplete)', (req, res) => {
    res.send('woot');
});

app.post('/tasks/:id/delete', (req, res) => {
    res.send('woot');
});

// Handle submission of new task form
app.post('/tasks/create', (req, res) => {
    res.send('woot');
});

// Start the server
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

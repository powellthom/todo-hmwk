// eslint no-param-reassign: ["error", { "props": false }]
// eslint no-underscore-dangle: ["error", { "allow": ["_id"] }]


'use strict';

const PORT=8080;
const MONGO_URL='mongodb://powellthom:account1@ds161493.mlab.com:61493/tp-todo-hmwk';
const SESSION_SECRET='4261Ln9MplIzXiOaHFZFq7Zq+1/Ksji3Xa+cs09uu8g=';
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const validator = require('validator');
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
        res.sendStatus(403);
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

// Handle submitted form for new users
app.post('/user/register', (req, res) => {
    res.send('woot');
});

app.post('/user/login', (req, res) => {
    res.send('woot');
});

// Log a user out
app.get('/user/logout', (req, res) => {
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
app.post('/task/create', (req, res) => {
    res.send('woot');
});

// Start the server
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

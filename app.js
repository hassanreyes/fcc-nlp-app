var express         = require('express');
var path            = require('path');
//var favicon       = require('serve-favicon');
//var logger        = require('morgan');
//var cookieParser    = require('cookie-parser');
var mongoose        = require("mongoose");
var bodyParser      = require('body-parser');
var express_session = require('express-session');
var routes          = require('./app/routes');
    
var app             = express(),
    router          = express.Router();
    
// Load enviroment variables from .env file
//require('dotenv').config();

//Connect to Nightlife Planner DB
var dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/nlf";
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express_session({ secret: 'fcc-nlp-app-secret', resave: true, saveUninitialized: true }));

//X-Origin Middleware 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POSTM GETM PATCH, DELETE, OPTIONS');
  next();
});

routes(app, router, null);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log("handling error...");
   res.render('index');
});


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
require('dotenv').config()


// initialize database
var mongoose = require('mongoose');
const mongoDb = process.env.MONGODB
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


const unless = (...paths) => (req, res, next) => paths.some(path => path === req.path) && next();

//initialize express and middleware
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));

// initialize routes
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var matchesRouter = require('./routes/matches')

// filter other apis
app.use(unless("/footystats/users", "/footystats/matches"));
app.use('/footystats/users', usersRouter);
app.use('/footystats/matches', matchesRouter);

// console.log(path.join(__dirname, '..', '/client/public/index.html'))

// app.get('/*', (req,res) => {
//   res.sendFile(path.join(__dirname, '..', '/client/public/index.html'));
  
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

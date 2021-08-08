var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// 404 error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = `Sorry! We couldn't find the page you were looking for.`;
  res.render('page-not-found', { err });
});

// global error handler
app.use(function(err, req, res, next) {
  err.status = ( err.status || 500 );
  err.message = ( err.message || 'Sorry! There was an unexpected error on the server.' );
  console.log(err.status, err.message);
  res.render('error', { err });
});

module.exports = app;

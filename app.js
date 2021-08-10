const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serve static files from public folder
app.use('/static', express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// 404 error handler
app.use( (req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = `Sorry! We couldn't find the page you were looking for.`;
  res.render('page-not-found', { err });
});

// global error handler
app.use( (err, req, res, next) => {
  err.status = ( err.status || 500 );
  err.message = ( err.message || 'Sorry! There was an unexpected error on the server.' );
  console.log(err.status, err.message);
  res.render('error', { err });
});

module.exports = app;

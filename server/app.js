var browserify = require('browserify-middleware');
var express = require('express');
var router = require('./router');
var path = require('path')
var port = process.env.PORT || 3000;
var app = express();
app.use('/assets', express.static(path.join('client', 'assets')));
app.use('/assets/bundle.js', browserify(path.join('client', 'index.js')))
app.use(router);
app.set('view engine', 'jade')
module.exports = app;

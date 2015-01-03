var browserify = require('browserify-middleware');
var express = require('express');
var app = express();
var router = require('./router');
var path = require('path')
app.use('/js/bundle.js', browserify(path.join('client','index.js')))
app.use(router);
var port = process.env.PORT || 3000;
app.set('view engine', 'jade')
module.exports = app;

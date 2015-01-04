var express = require('express');
var app = module.exports = express();
var browserify = require('browserify-middleware');
var path = require('path')
var port = process.env.PORT || 3000;
app.set('view engine', 'jade')
app.use('/assets', express.static(path.join('client', 'assets')));
app.use('/assets/bundle.js', browserify(path.join('client', 'index.js')))
app.get('/', function(req,res,next) {
  app.probeManager.getProbes(function(err, probes) {
    if (err) return next(err);
    res.render('index', {
      probes: probes,
      baudrates: baudrates,
      options: app.probeManager.options
    })
  })
});
var baudrates = [
  115200
  , 57600 
  , 38400 
  , 19200 
  , 9600  
  , 4800  
  , 2400  
  , 1800  
  , 1200  
  , 600   
  , 300   
  , 200   
  , 150   
  , 134   
  , 110   
  , 75    
  , 50    
]

var r = module.exports = require('express').Router()

r.get('/', function(req,res,next) {
  require('serialport').list(function (err, ports) {
    if (err) return next(err);
    res.render('index', {
      ports: ports
    })
  })
});

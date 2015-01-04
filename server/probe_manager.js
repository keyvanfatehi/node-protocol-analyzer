module.exports = ProbeManager
var serialport = require('serialport')
var Probe = require('./probe')

function ProbeManager() {
  this._probes = {};
}

ProbeManager.prototype.setOptions = function(opts) {
  this.options = opts;
}

ProbeManager.prototype.openProbe = function(name, cb) {
  var options = this.options;
  this.getProbe(name, function(err, probe) {
    if (err) return cb(err);
    probe.setOptions(options);
    probe.open(function(err) {
      if (err) return cb(err);
      probe.isOpen = true;
      console.log(probe);
      cb();
    })
  })
}

ProbeManager.prototype.closeProbe = function(name, cb) {
  this.getProbe(name, function(err, probe) {
    if (err) return cb(err);
    probe.close(function(err) {
      if (err) return cb(err);
      probe.isOpen = false;
      cb();
    })
  })
}

ProbeManager.prototype.getProbe = function(name, cb) {
  this.getProbes(function(err, probes) {
    cb(err, probes[name]);
  })
}

ProbeManager.prototype.getProbes = function(cb) {
  var pm = this;
  serialport.list(function (err, ports) {
    if (err) return cb(err);
    ports.forEach(function(port) {
      var probe = pm._probes[port.comName] || new Probe(port);
      pm._probes[port.comName] = probe;
    })
    cb(null, pm._probes);
  })
}

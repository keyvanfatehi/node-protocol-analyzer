module.exports = ProbeManager
var _ = require('lodash')
var serialport = require('serialport')
var Probe = require('./probe')

function ProbeManager() {
  this._probes = {};
  this.options = {
    baudRate: 9600
  };
}

ProbeManager.prototype.setOptions = function(opts) {
  this.options = {
    baudRate: parseInt(opts.baudRate)
  };
}

ProbeManager.prototype.openProbe = function(name, cb) {
  var options = this.options;
  this.getProbe(name, function(err, probe) {
    if (err) return cb(err);
    if (probe.isOpen) return cb(null, probe);
    probe.setOptions(options);
    probe.open(function(err) {
      if (err) return cb(err);
      probe.isOpen = true;
      cb(null, probe);
    })
  })
}

ProbeManager.prototype.closeProbe = function(name, cb) {
  this.getProbe(name, function(err, probe) {
    if (err) return cb(err);
    if (!probe.isOpen) return cb();
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

ProbeManager.prototype.getOpenProbes = function(cb) {
  this.getProbes(function(err, probes) {
    if (err) return cb(err);
    cb(err, _.where(probes, { isOpen: true }));
  })
}

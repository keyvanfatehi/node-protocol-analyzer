module.exports = ProbeManager
var _ = require('lodash')
var serialport = require('serialport')
var Probe = require('./probe')
var dsl = require('../lib/dsl')
var MitmSession = require('./mitm_session');

function ProbeManager() {
  this._probes = {};
  this.options = {
    baudRate: 38400,
    mode: 'mitm',
    script: this.script || dsl.exampleScript
  };
}

ProbeManager.prototype.setOptions = function(opts) {
  this.options = {
    baudRate: parseInt(opts.baudRate),
    mode: opts.mode
  };
}

ProbeManager.prototype.openProbe = function(name, direction, cb) {
  var options = this.options;
  var mode = options.mode;
  this.getProbe(name, function(err, probe) {
    if (err) return cb(err);
    if (probe.isOpen) return cb(null, probe);
    probe.setOptions(options);
    probe.setDirection(direction);
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

ProbeManager.prototype.createMitmSession = function(script, cb) {
  this.getProbes(function(err, probes) {
    if (err) return cb(err);
    var downstream = _.find(probes, { isOpen: true, direction: 'downstream' });
    var upstream = _.find(probes, { isOpen: true, direction: 'upstream' });
    if (upstream && downstream) {
      var session = new MitmSession();
      session.setProbes(upstream, downstream);
      session.setScript(script);
      return cb(null, session);
    }
    return cb(new Error("You must designate upstream and downstream ports"));
  })
}

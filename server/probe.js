module.exports = Probe;
var SerialPort = require('serialport').SerialPort
function Probe(port){
  this.isOpen = false;
  this.port = port;
  this.name = port.comName;
  this._serialport = null;
}

Probe.prototype.setOptions = function(opts) {
  this.options = opts;
}

Probe.prototype.setDirection = function(direction) {
  this.direction = direction;
  console.log(this.name, this.direction, this.options.mode);
  console.log('so whats it mean for Probe to be set in a direction ?');
}

Probe.prototype.createSerialPort = function() {
  this._serialport = null;
  this._serialport = new SerialPort(this.name, this.options);
}
 
Probe.prototype.open = function(cb) {
  if (this.isOpen) return cb(new Error('Port is already open.'));
  this.createSerialPort();
  this.getSerialPort().on('open', cb);
}

Probe.prototype.close = function(cb) {
  if (this.isOpen) return this.getSerialPort().close(cb);
  return cb(new Error('Port is already closed.'));
}

Probe.prototype.getSerialPort = function() {
  return this._serialport;
}

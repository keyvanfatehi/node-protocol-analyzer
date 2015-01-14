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
}

Probe.prototype.createSerialPort = function() {
  this._serialport = null;
  this._serialport = new SerialPort(this.name, {
    baudRate: this.options.baudRate,
    dtr: this.options.dtr || false,
    dts: this.options.dts || false
  });
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

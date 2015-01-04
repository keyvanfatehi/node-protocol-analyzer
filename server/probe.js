module.exports = Probe;
var SerialPort = require('serialport').SerialPort
function Probe(port){
  this.isOpen = false;
  this.port = port;
  this._serialport = null;
}

Probe.prototype.setOptions = function(opts) {
  this.options = opts;
}
 
// below try catches dont work because ther is an error happening async somewhere
// we can catch it if we start using promises, or we can use domain

Probe.prototype.open = function(cb) {
  try {
    this._serialport = new SerialPort(this.port.comName)
    this._serialport.on('open', cb);
  } catch (e) {
    cb(e)
  }
}

Probe.prototype.close = function(cb) {
  console.log(this);
  try {
    this._serialport.close(cb);
  } catch (e) {
    cb(e)
  }
}

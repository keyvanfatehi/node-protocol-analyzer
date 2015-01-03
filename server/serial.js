var serialport = require('serialport')
var SerialPort = serialport.SerialPort
var opts = {
  baudrate: 38400
}

serialport.list(function (err, ports) {
  ports.forEach(function (port) {
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  })
})

var COM4 = new SerialPort('COM4', opts)
var COM5 = new SerialPort('COM5', opts)
COM4.on('open', handler(COM4))
COM5.on('open', handler(COM5))

function handler(port) {
  return function() {
    port.on('data', function(chk) {
      console.log(port.path, 'data', chk.toString())
    })
    console.log(port.path, 'open')
  }
}

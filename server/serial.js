var serialport = require('serialport')
var SerialPort = serialport.SerialPort
var opts = {
  baudRate: 38400
}

var upstream = new SerialPort('/dev/ttyO2', opts)
var downstream = new SerialPort('/dev/ttyO1', opts)

upstream.on('open', function() {
  downstream.on('open', function() {
    bridge();
    console.log('bridged');
  })
})

function bridge() {
  upstream.on('data', function(chk) {
    console.log(chk.toString());
    downstream.write(chk);
  })

  downstream.on('data', function(chk) {
    console.log(chk.toString());
    upstream.write(chk);
  })
}

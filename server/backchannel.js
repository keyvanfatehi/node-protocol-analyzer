var SocketIO = require('socket.io');
module.exports = BackChannel
  
function BackChannel(probeManager) {
  var bc = this;
  this.io = new SocketIO();
  this.io.on('connection', function(socket) {
    socket.on('activate probe', function(name, baudrate) {
      probeManager.setOptions({ baudrate: baudrate })
      probeManager.openProbe(name, function(err, probe) {
        if (err) return bc.err(err);
        bc.info('opened '+name);
      })
    });

    socket.on('deactivate probe', function(name) {
      probeManager.closeProbe(name, function(err) {
        if (err) return bc.err(err);
        bc.info('closed '+name);
      })
    });

    socket.on('change baudrate', function(baudrate) {
      //probeManager.setOptions({ baudrate: baudrate })
      //close and reopen open probes
      console.log('reconfiguring probes with new buad rate', rate);
    })
  });
}

BackChannel.prototype.err = function(err) {
  console.error(err.stack);
  this.io.sockets.emit('err', err.stack);
}

BackChannel.prototype.info = function(msg) {
  console.log(msg);
  this.io.sockets.emit('info', msg);
}

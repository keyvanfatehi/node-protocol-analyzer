var SocketIO = require('socket.io');
module.exports = BackChannel
  
function BackChannel(probeManager) {
  var bc = this;

  function openProbe(name) {
    probeManager.openProbe(name, function(err, probe) {
      if (err) return bc.err(err);
      probe.getSerialPort().on('close', function() {
        bc.probeClosed(probe);
      });
      bc.probeOpened(probe);
    });
  }

  function closeProbe(name) {
    probeManager.closeProbe(name, function(err) {
      if (err) return bc.err(err);
    });
  }

  function changeProbeOptions(options) {
    probeManager.setOptions(options);
    probeManager.getOpenProbes(function(err, openProbes) {
      if (err) return bc.err(err);
      openProbes.forEach(function(probe) {
        probe.getSerialPort().on('close', function() {
          openProbe(probe.name);
        });
        closeProbe(probe.name);
      });
    });
  }

  this.io = new SocketIO();
  this.io.on('connection', function(socket) {
    socket.on('activate probe', function(name, baudrate) {
      probeManager.setOptions({ baudrate: baudrate });
      openProbe(name);
    });

    socket.on('deactivate probe', function(name) {
      closeProbe(name);
    });

    socket.on('change baudrate', function(baudrate) {
      changeProbeOptions({ baudrate: baudrate });
    });
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

BackChannel.prototype.probeClosed = function(probe) {
  this.io.sockets.emit('probe closed', probe.name);
  this.info(probe.name+' closed');
}

BackChannel.prototype.probeOpened = function(probe) {
  this.io.sockets.emit('probe opened', probe.name);
  this.info(probe.name+' opened at '+probe.options.baudrate+' baud');
}

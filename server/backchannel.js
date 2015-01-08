var SocketIO = require('socket.io');
var _ = require('lodash');
module.exports = BackChannel
  
function BackChannel(probeManager) {
  var bc = this;

  function openProbe(name) {
    probeManager.openProbe(name, function(err, probe) {
      if (err) return bc.err(err);
      probe.getSerialPort().on('close', function() {
        bc.probeClosed(probe);
      });
      probe.getSerialPort().on('data', function(buf) {
        bc.gotProbeData(probe, buf);
      });
      bc.probeOpened(probe);
    });
  }

  function closeProbe(name) {
    probeManager.closeProbe(name, function(err) {
      if (err) return bc.err(err);
    });
  }

  function changeSerialOptions(options) {
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
    bc.changedOptions(options);
  }

  this.io = new SocketIO();
  this.io.on('connection', function(socket) {
    socket.on('change activeProbes', function(activeProbes) {
      probeManager.getProbes(function(err, probes) {
        if (err) return bc.err(err);
        _.each(probes, function(probe) {
          var name = probe.name;
          var beActive = _.contains(activeProbes, name)
          if (beActive) return openProbe(name);
          if (! beActive) return closeProbe(name);
        })
      });
    });

    socket.on('change baudRate', function(baudRate) {
      changeSerialOptions({ baudRate: baudRate });
    });

    socket.on('change mode', function(mode) {
      changeSerialOptions({ mode: mode });
    });

    socket.on('change probeAliases', function(probeAliases) {
      console.log(probeAliases);
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

BackChannel.prototype.probeClosed = function(probe) {
  this.io.sockets.emit('probe closed', probe.name);
  this.info(probe.name+' closed');
}

BackChannel.prototype.probeOpened = function(probe) {
  this.io.sockets.emit('probe opened', probe.name);
  this.info(probe.name+' opened at '+probe.options.baudRate+' baud');
}

BackChannel.prototype.changedOptions = function(options) {
  this.io.sockets.emit('changed options', options);
}

BackChannel.prototype.gotProbeData = function(probe, buffer) {
  this.io.sockets.emit('probe data', probe.name, buffer);
}

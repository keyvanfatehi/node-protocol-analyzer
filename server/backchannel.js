var SocketIO = require('socket.io');
var _ = require('lodash');
module.exports = BackChannel
  
function BackChannel(probeManager) {
  this.pm = probeManager;
  var bc = this;

  function openProbe(name, direction) {
    var mode = probeManager.options.mode;
    probeManager.openProbe(name, direction, function(err, probe) {
      if (err) return bc.err(err);
      probe.getSerialPort().on('close', function() {
        bc.probeClosed(probe, mode);
      });
      probe.getSerialPort().on('data', function(buf) {
        bc.gotProbeData(probe, buf);
      });
      bc.probeOpened(probe, mode);
    });
  }

  function closeProbe(name) {
    probeManager.closeProbe(name, function(err) {
      if (err) return bc.err(err);
    });
  }

  function changeSerialOptions(options) {
    var modeNotBeingChanged = !options.mode;
    probeManager.setOptions(options);
    probeManager.getOpenProbes(function(err, openProbes) {
      if (err) return bc.err(err);
      openProbes.forEach(function(probe) {
        if (modeNotBeingChanged) {
          probe.getSerialPort().on('close', function() {
            openProbe(probe.name);
          });
        }
        closeProbe(probe.name);
      });
    });
    bc.changedOptions(options);
  }

  function getDirection(obj, target) {
    if (probeManager.options.mode !== 'mitm') return null;
    if (obj.upstream === target) return 'upstream';
    if (obj.downstream === target) return 'downstream';
  }

  this.io = new SocketIO();
  this.io.on('connection', function(socket) {
    socket.on('change activeProbes', function(activeProbes) {
      probeManager.getProbes(function(err, probes) {
        if (err) return bc.err(err);
        _.each(probes, function(probe) {
          var name = probe.name;
          var beActive = _.contains(activeProbes, name)
          var direction = getDirection(activeProbes, name);
          if (beActive) return openProbe(name, direction);
          if (! beActive) return closeProbe(name, direction);
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

BackChannel.prototype.probeClosed = function(probe, mode) {
  this.io.sockets.emit('probe closed', probe.name, mode, probe.direction);
  this.info(probe.name+' closed');
}

BackChannel.prototype.probeOpened = function(probe, mode) {
  this.io.sockets.emit('probe opened', probe.name, mode, probe.direction);
  this.info(probe.name+' opened at '+probe.options.baudRate+' baud');
}

BackChannel.prototype.changedOptions = function(options) {
  this.io.sockets.emit('changed options', options);
}

BackChannel.prototype.gotProbeData = function(probe, buffer) {
  this.io.sockets.emit('probe data', probe.name, buffer);
}

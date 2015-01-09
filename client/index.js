window.$ = require('jquery');
window.socket = require('./socket');
require('./require_socket')();
require('./socket_console')();
var ConfigWindow = require('./config_window');
var ProbeSelector = require('./probe_selector');
var Workspace = require('./workspace');
var workspace = new Workspace();
var config = new ConfigWindow();
var probeSelector = new ProbeSelector();

$('body').append(workspace.$el);

config.on('change', function(changedKeys, attributes) {
  changedKeys.forEach(function(key) {
    socket.emit('change '+key, attributes[key]);
  })
})

socket.on('probe closed', config.portWasClosed.bind(config));
socket.on('probe opened', config.portWasOpened.bind(config));

socket.on('changed options', function(options) {
  config.optionsWereChanged(options);
})

socket.on('probe data', function(probe, data) {
  workspace.handleProbeData(probe, data);
});

config.on('changed mode', function(mode) {
  probeSelector.setMode(mode);
})

config.on('mitm run', function(script) {
  socket.emit('mitm run', script);
})

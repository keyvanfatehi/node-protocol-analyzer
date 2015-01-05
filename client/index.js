window.$ = require('jquery');
window.socket = require('./socket');
require('./require_socket')();
require('./socket_console')();
var ConfigWindow = require('./config_window');
var Workspace = require('./workspace');
var workspace = new Workspace();
var config = new ConfigWindow();

$('body').append(workspace.$el);

config.on('change', function(changedKeys, attributes) {
  changedKeys.forEach(function(key) {
    socket.emit('change '+key, attributes[key]);
  })
})

socket.on('probe closed', function(name) {
  config.getPortCheckbox(name).prop('checked', false);
})

socket.on('probe opened', function(name) {
  config.getPortCheckbox(name).prop('checked', true);
})

socket.on('changed options', function(options) {
  config.setOptions(options);
})

socket.on('probe data', function(probe, data) {
  workspace.handleProbeData(probe, data);
});

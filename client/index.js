window.$ = require('jquery')
window.socket = require('./socket')
var ConfigWindow = require('./config_window.js')
var Workspace = require('./workspace')
var workspace = new Workspace();

$('.main').append(workspace.$el);

var config = new ConfigWindow(socket);

socket.on('err', function(stack) {
  console.error('Backend '+stack);
})

socket.on('info', function(msg) {
  console.info('Backend Info: '+msg);
})

socket.on('connect', function() {
  $('#disconnected').hide()
  $('#connected').show()
})

socket.on('disconnect', function() {
  $('#connected').hide()
  $('#disconnected').show()
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

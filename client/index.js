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
  config.optionsWereChanged(options);
})

socket.on('probe data', function(probe, data) {
  workspace.handleProbeData(probe, data);
});


function ProbeSelector() {
  this.$el = $('.probe-selection')
  this.setMode(this.getMode());
}

ProbeSelector.prototype.getMode = function() {
  return this.$el.data('mode');
}

ProbeSelector.prototype.setMode = function(mode) {
  console.log(mode);
  this.$el.data(mode);
  this.$el.find('>section').hide();
  this.$el.find('>section[data-mode='+mode+']').show();
}

var probeSelector = new ProbeSelector();
console.log(probeSelector);

config.on('changed mode', function(mode) {
  probeSelector.setMode(mode);
})

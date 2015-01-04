window.$ = require('jquery')
window.socket = require('./socket')

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
  getPortCheckbox(name).prop('checked', false);
})

socket.on('probe opened', function(name) {
  getPortCheckbox(name).prop('checked', true);
})

function getPortCheckbox(name) {
  return $('#ports input[value="'+name+'"]');
}

function getSelectedPorts() {
  return $('#ports input:checked').map(function(i,e){ return e.value })
}

$('#ports input').change(function() {
  var ports = getSelectedPorts();
  var $el = $(this);
  var checked = $el.prop('checked');
  var name = $el.val();
  if (ports.length > 2) return $el.prop('checked', false);
  if (checked) socket.emit('activate probe', name, getBaudRate());
  else socket.emit('deactivate probe', name);
})

var $baudRate = $('#baudrate').change(function() {
  var $el = $(this)
  var val = parseInt($el.val()) || 9600;
  $el.val(val)
  socket.emit('change baudrate', getBaudRate());
})

function getBaudRate() {
  return $baudRate.val()
}

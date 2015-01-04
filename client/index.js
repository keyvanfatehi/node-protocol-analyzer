window.$ = require('jquery')
window.socket = require('./socket')

socket.on('connect', function() {
  $('#disconnected').hide()
  $('#connected').show()
})

socket.on('disconnect', function() {
  $('#connected').hide()
  $('#disconnected').show()
})

$('#ports input').change(function(e) {
  var ports = getSelectedPorts();
  var $el = $(this);
  var checked = $el.prop('checked');
  var name = $el.val();
  if (ports.length > 2) return $el.prop('checked', false);
  if (checked) socket.emit('activate probe', name);
  else socket.emit('deactivate probe', name);
})

$('button#start').click(function() {
  var ports = getSelectedPorts()
  $('#ports input:checked')
})

function getSelectedPorts() {
  return $('#ports input:checked').map(function(i,e){ return e.value })
}

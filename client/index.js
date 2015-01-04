window.$ = require('jquery')
window.socket = require('./socket')

$('#ports input').change(function(e) {
  var ports = getSelectedPorts();
  if (ports.length > 2) return $(e.target).prop('checked', false);
  if (ports.length === 2) socket.emit('select probes', ports[0], ports[1]);
})

$('button#start').click(function() {
  var ports = getSelectedPorts()
  $('#ports input:checked')
})

function getSelectedPorts() {
  return $('#ports input:checked').map(function(i,e){ return e.value })
}

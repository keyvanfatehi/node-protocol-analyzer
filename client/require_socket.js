module.exports = requireSocket;
var $ = require('jquery')
var socket = require('./socket')
function requireSocket() {
  socket.on('connect', function() {
    $('.require-socket').addClass('connected');
  })
  socket.on('disconnect', function() {
    $('.require-socket').removeClass('connected')
  })
}

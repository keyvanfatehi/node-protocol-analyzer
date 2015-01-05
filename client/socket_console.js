module.exports = socketConsole;
var socket = require('./socket')

function socketConsole() {
  socket.on('err', function(stack) {
    console.error('Backend '+stack);
  })

  socket.on('info', function(msg) {
    console.info('Backend Info: '+msg);
  })
}

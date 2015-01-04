var SocketIO = require('socket.io');
var io = new SocketIO();

io.on('connection', function(socket) {
  socket.on('select probes', function(a, b) {
    console.log('got data', data);
  });
});

module.exports = io;

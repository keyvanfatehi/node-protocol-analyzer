var SocketIO = require('socket.io');
var io = new SocketIO();

io.on('connection', function(socket) {
  console.log('connected');
  socket.on('evt', function(data) {
    console.log('got data', data);
  });
});

module.exports = io;

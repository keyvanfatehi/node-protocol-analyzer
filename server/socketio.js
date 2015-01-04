var SocketIO = require('socket.io');
var io = new SocketIO();

io.on('connection', function(socket) {
  socket.on('activate probe', function(name) {
    console.log('activating probe', name);
  });

  socket.on('deactivate probe', function(name) {
    console.log('deactivating probe', name);
  });
});

module.exports = io;

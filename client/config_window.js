module.exports = ConfigWindow;

function ConfigWindow(socket){
  var self = this;

  this.$baudRate = $('#baudrate').change(function() {
    var $el = $(this)
    var val = parseInt($el.val()) || 9600;
    $el.val(val)
    socket.emit('change baudrate', self.getBaudRate());
  })

  $('#ports input').change(function() {
    var ports = self.getSelectedPorts();
    var $el = $(this);
    var checked = $el.prop('checked');
    var name = $el.val();
    if (ports.length > 2) return $el.prop('checked', false);
    if (checked) {
      socket.emit('activate probe', name, self.getBaudRate());
    } else {
      socket.emit('deactivate probe', name);
    }
  })
}

ConfigWindow.prototype = {
  setOptions: function(options) {
    $('select#baudrate').val(options.baudrate);
  },
  getBaudRate: function() {
    return this.$baudRate.val()
  },
  getPortCheckbox: function(name) {
    return $('#ports input[value="'+name+'"]');
  },
  getSelectedPorts: function() {
    var fn = function(i,e){ return e.value }
    return $('#ports input:checked').map(fn)
  }
}

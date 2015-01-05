module.exports = ConfigWindow;
var socket = require('./socket')
var $ = require('jquery')

function ConfigWindow(){
  this.$el = $('.configuration.window');
  this.socket = socket;
  var self = this;

  this.$baudRate = this.$('#baudrate').change(function() {
    self.handleBaudRateChange(this);
  })

  $('#ports input').change(function() {
    self.handleActiveProbeChange(this)
  })
}

ConfigWindow.prototype = {
  $: function(selector) {
    return this.$el.find(selector)
  },
  handleBaudRateChange: function(eventTarget) {
    var $el = $(eventTarget)
    var val = parseInt($el.val()) || 9600;
    $el.val(val)
    this.socket.emit('change baudrate', this.getBaudRate());
  },
  handleActiveProbeChange: function(eventTarget) {
    var ports = this.getSelectedPorts();
    var $el = $(eventTarget);
    var checked = $el.prop('checked');
    var name = $el.val();
    if (ports.length > 2) return $el.prop('checked', false);
    if (checked) {
      this.socket.emit('activate probe', name, this.getBaudRate());
    } else {
      this.socket.emit('deactivate probe', name);
    }
  },
  setOptions: function(options) {
    this.$('select#baudrate').val(options.baudrate);
  },
  getBaudRate: function() {
    return this.$baudRate.val()
  },
  getPortCheckbox: function(name) {
    return this.$('#ports input[value="'+name+'"]');
  },
  getSelectedPorts: function() {
    var fn = function(i,e){ return e.value }
    return this.$('#ports input:checked').map(fn)
  }
}

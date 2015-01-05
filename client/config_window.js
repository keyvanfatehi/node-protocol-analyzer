module.exports = ConfigWindow;
var $ = require('jquery');
var EventEmitter = require('node-event-emitter').EventEmitter;

function ConfigWindow(){
  this.emitter = new EventEmitter();
  this.on = this.emitter.on;
  this.emit = this.emitter.emit;
  this.$el = $('.configuration.window');
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
  getAttributes: function() {
    return {
      baudRate: this.getBaudRate(),
      activeProbes: this.getSelectedPorts()
    }
  },
  handleBaudRateChange: function(eventTarget) {
    var $el = $(eventTarget)
    var val = parseInt($el.val()) || 9600;
    $el.val(val)
    this.emit('change', ['baudRate'], this.getAttributes());
  },
  handleActiveProbeChange: function(eventTarget) {
    var ports = this.getSelectedPorts();
    var $el = $(eventTarget);
    var checked = $el.prop('checked');
    var name = $el.val();
    if (ports.length > 2) return $el.prop('checked', false);
    this.emit('change', ['activeProbes'], this.getAttributes());
  },
  setOptions: function(options) {
    this.$('select#baudrate').val(options.baudRate);
  },
  getBaudRate: function() {
    return parseInt(this.$baudRate.val())
  },
  getPortCheckbox: function(name) {
    return this.$('#ports input[value="'+name+'"]');
  },
  getSelectedPorts: function() {
    var out = []
    this.$('#ports input:checked').each(function(i, el) {
      out.push(el.value);
    })
    return out;
  }
}

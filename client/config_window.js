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

  this.$('.probe input.active').change(function() {
    self.handleActiveProbeChange(this)
  })

  this.$('.probe input.alias').keyup(function() {
    self.handleAliasUpdate(this)
  })
}

ConfigWindow.prototype = {
  $: function(selector) {
    return this.$el.find(selector)
  },
  getAttributes: function() {
    return {
      baudRate: this.getBaudRate(),
      activeProbes: this.getSelectedPorts(),
      probeAliases: this.getProbeAliases()
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
  handleAliasUpdate: function(eventTarget) {
    this.emit('change', ['probeAliases'], this.getAttributes());
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
    this.$('.probe input.active:checked').each(function(i, el) {
      out.push(el.value);
    })
    return out;
  },
  getProbeAliases: function() {
    var out = {}
    this.$('.probe input.alias').each(function(i, el) {
      out[el.attributes['data-name'].value] = el.value
    })
    return out;
  }
}

module.exports = ConfigWindow;
var RollupWindow = require('./rollup_window');
var $ = require('jquery');
var EventEmitter = require('node-event-emitter').EventEmitter;

function ConfigWindow(){
  this.emitter = new EventEmitter();
  this.on = this.emitter.on;
  this.emit = this.emitter.emit;
  this.$el = $('.configuration.window');
  this.initialize();
}

ConfigWindow.prototype = {
  $: function(selector) {
    return this.$el.find(selector)
  },
  initialize: function() {
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

    this.$('.mode-selection input').change(function() {
      self.handleModeChange(this)
    })

    RollupWindow.setup(this.$el);
  },
  getAttributes: function() {
    return {
      baudRate: this.getBaudRate(),
      mode: this.getSelectedMode(),
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
  handleModeChange: function() {
    this.emit('change', ['mode'], this.getAttributes());
  },
  optionsWereChanged: function(options) {
    var keys = Object.keys(options)
    for (var i=0; i<keys.length; i++) {
      var key = keys[i];
      var value = options[key];
      this.optionWasChanged[key](this, value);
    }
  },
  optionWasChanged: {
    baudRate: function(self, newBaudRate) {
      self.$('select#baudrate').val(newBaudRate);
    },
    mode: function(self, newMode) {
      self.$('.mode-selection input[value='+newMode+']').prop('checked', true)
      self.emit('changed mode', newMode);
    }
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
  getSelectedMode: function() {
    return this.$('.mode-selection input:checked').val();
  },
  getProbeAliases: function() {
    var out = {}
    this.$('.probe input.alias').each(function(i, el) {
      out[el.attributes['data-name'].value] = el.value
    })
    return out;
  }
}

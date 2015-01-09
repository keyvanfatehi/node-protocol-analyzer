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

    this.$('.sniffer-probe input.active').change(function() {
      self.handleSnifferProbeChange(this);
    })

    this.$('.mitm-port select').change(function() {
      self.handleMitmPortChange(this);
    })

    this.$('.sniffer-probe input.alias').keyup(function() {
      self.handleAliasUpdate(this)
    })

    this.$('.mode-selection input').change(function() {
      self.handleModeChange(this)
    })

    this.$('section[data-mode=mitm] button[value=run]').click(function() {
      self.emit('mitm run', self.getMitmScript());
    });

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
  handleSnifferProbeChange: function(eventTarget) {
    var ports = this.getSelectedPorts();
    var $el = $(eventTarget);
    var checked = $el.prop('checked');
    var name = $el.val();
    if (ports.length > 2) return $el.prop('checked', false);
    this.emit('change', ['activeProbes'], this.getAttributes());
  },
  handleMitmPortChange: function(eventTarget) {
    var $el = $(eventTarget);
    var direction = $el.data('direction');
    var value = $el.val();
    var ports = this.getSelectedPorts();
    var samePort = ports.upstream === ports.downstream;
    if (value !== '' && samePort) return $el.val('');
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
      self.$('.mode-selection input[value='+newMode+']').prop('checked', true);
      self.emit('changed mode', newMode);
    }
  },
  getBaudRate: function() {
    return parseInt(this.$baudRate.val())
  },
  getSnifferProbeCheckbox: function(name) {
    return this.$('.sniffer-probe input[value="'+name+'"]');
  },
  getMitmSelect: function(direction) {
    var sel = '.mitm-port select[data-direction='+direction+']'; 
    return this.$(sel);
  },
  getMitmValue: function(direction) {
    var value = this.getMitmSelect(direction).val();
    return value === '' ? null : value;
  },
  portWasClosed: function(name, modeWhenOpened, direction) {
    this.caseMode({
      sniffer: function() {
        this.getSnifferProbeCheckbox(name).prop('checked', false);
      },
      mitm: function() {
        this.getMitmSelect(direction).val('');
      }
    }, modeWhenOpened);
  },
  portWasOpened: function(name, mode, direction) {
    this.caseMode({
      sniffer: function() {
        this.getSnifferProbeCheckbox(name).prop('checked', true);
      },
      mitm: function() {
        this.getMitmSelect(direction).val(name);
      }
    })
  },
  caseMode: function(funcList, modeOverride) {
    var mode = modeOverride || this.getSelectedMode();
    if (mode === "sniffer") return funcList.sniffer.bind(this)();
    else if (mode === "mitm") return funcList.mitm.bind(this)();
    else throw new Error('Unsupported mode '+mode);
  },
  getSelectedPorts: function() {
    return this.caseMode({
      sniffer: this.getSnifferPorts,
      mitm: this.getMitmPorts
    })
  },
  getSnifferPorts: function() {
    var out = []
    this.$('.sniffer-probe input.active:checked').each(function(i, el) {
      out.push(el.value);
    })
    return out;
  },
  getMitmPorts: function() {
    return {
      upstream: this.getMitmValue('upstream'),
      downstream: this.getMitmValue('downstream')
    };
  },
  getMitmScript: function() {
    return this.$('.mitm-script').text();
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

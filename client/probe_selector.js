module.exports = ProbeSelector;

function ProbeSelector() {
  this.$el = $('.probe-selection')
  this.setMode(this.getMode());
}

ProbeSelector.prototype.getMode = function() {
  return this.$el.data('mode');
}

ProbeSelector.prototype.setMode = function(mode) {
  this.$el.find('>section').hide();
  this.$el.find('>section[data-mode='+mode+']').show();
  this.$el.data(mode);
}

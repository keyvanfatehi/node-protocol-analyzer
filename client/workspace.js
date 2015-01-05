var $ = require('jquery')
module.exports = Workspace;
function Workspace(selector) {
  this.el = $(selector).get(0);
  this.$el = $(this.el);
}

Workspace.prototype.message = function() {
  console.log(arguments)
}

Workspace.prototype.handleProbeData = function(probe, data) {
  console.info(probe+" sniffed "+data.byteLength+" bytes")
  var box = $('<div class="'+probe.name+'"/>');
  box.append(probe+" sniffed "+data.byteLength+" bytes");
  this.$el.append(box);
}

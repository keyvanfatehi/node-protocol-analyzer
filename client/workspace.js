var $ = require('jquery')
module.exports = Workspace;
function Workspace() {
  this.$el = $('<div class=workspace/>');
}

Workspace.prototype.handleProbeData = function(probe, data) {
  console.info(probe+" sniffed "+data.byteLength+" bytes")
  var box = $('<div class="'+probe.name+'"/>');
  box.append(probe+" sniffed "+data.byteLength+" bytes");
  this.$el.append(box);
}

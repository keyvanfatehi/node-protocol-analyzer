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
  console.log(probe, data.length)
}

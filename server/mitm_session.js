module.exports = MitmSession;
var _ = require('lodash');
function MitmSession(){}

MitmSession.prototype.setProbes = function(upstream, downstream) {
  this.upstream = upstream;
  this.downstream = downstream;
}

MitmSession.prototype.setScript = function(script) {
  this.script = script;
  // we can use new Function(), see http://www.permadi.com/tutorial/jsFunc/
}

MitmSession.prototype.start = function() {
  var upstream = this.upstream.getSerialPort();
  var downstream = this.downstream.getSerialPort();
  upstream.pipe(downstream);
  downstream.pipe(upstream);
  /*
  upstream.on('data', function(buffer) {
    console.log('upstream sent '+buffer.length+' bytes, forwarding downstream');
    //downstream.write(buffer);
  });
  downstream.on('data', function(buffer) {
    console.log('downstream sent '+buffer.length+' bytes, forwarding upstream');
    //upstream.write(buffer);
  });
 */
}

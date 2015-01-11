module.exports = {
  exampleScript: exampleScript
}

function exampleScript(upstream, downstream) {
  upstream.on('data', function(buffer) {
    downstream.write(buffer);
  });
  downstream.on('data', function(buffer) {
    upstream.write(buffer);
  });
};

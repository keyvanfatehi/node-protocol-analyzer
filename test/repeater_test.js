var ProbeManager = require('../server/probe_manager');
var probeManager = new ProbeManager();

var config = {
  baudRate: 38400,
  mode: 'mitm',
  upstream: '/dev/ttyO2',
  downstream: '/dev/ttyO1'
}

probeManager.setOptions({
  baudRate: config.baudRate,
  mode: config.mode
})

probeManager.openProbe(config.upstream, 'upstream', function(err, upstream) {
  if (err) throw err;
  console.log(upstream.name, 'opened as upstream');
  probeManager.openProbe(config.downstream, 'downstream', function(err, downstream) {
    if (err) throw err;
    console.log(downstream.name, 'opened as downstream');
    probeManager.createMitmSession('', function(err, session){
      if (err) throw err;
      session.start();
      console.log('started mitm session');
    });
  })
})


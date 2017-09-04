var path = require('path'),
config = require(path.resolve('./config/config')),
axios = require('axios');

var network = config.blockchain.neo.network,
    port = 20332,
    cozPort = 8880,
    cozNetwork = 'test',
    nodes = [];

//identify which network to configure for.
if (network == 'mainnet') {
  port = 10332;
  cozPort = 8080,
  cozNetwork = 'seed';
}

var neoSeeds = [
  'http://seed1.neo.org',
  'http://seed2.neo.org',
  'http://seed3.neo.org',
  'http://seed4.neo.org',
  'http://seed5.neo.org',
  'http://seed8.antshares.org',
  'http://api.otcgo.cn'];


//build the list of neo-maintained nodes
neoSeeds.forEach(function(domain){
  nodes.push(new node(
      {
       domain: domain,
       port: port
      }
  ))
});


//build the list of CoZ maintained nodes
var cozNodes = [1,2,3,4,5].map(function(i){
  var domain = 'http://' + cozNetwork + i + '.cityofzion.io';
  nodes.push(new node(
      {
        domain: domain,
        port: cozPort,
      }
  ))
});



function node(conf){

  this.domain = conf.domain;
  this.port = conf.port;
  this.age = 0;
  this.active = true;
  this.latency = 0;
  this.blockHeight = 0;

  this.call = function(payload){
    var node = this;

    return new Promise(function( resolve, reject) {
      var t0 = Date.now();

      axios({
        method: 'post',
        url: node.domain + ':' + node.port,
        data: {"jsonrpc": "2.0", "method": payload.method, "params": payload.params, "id": payload.id},
        timeout: 5000
      })
        .then(function (response) {
          node.age = Date.now();
          node.latency = node.age - t0;
          node.active = true;
          resolve(response.data);
        })
        .catch(function (err) {
          node.age = Date.now();
          node.active = false;
          return reject(err);
        });
    });
  }
}

//export the node list
exports.nodes = nodes;

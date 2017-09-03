var path = require('path');
config = require(path.resolve('./config/config'));

var network = config.blockchain.neo.network;

var port = 20332,
    cozNetwork = 'test';


//identify which network to configure for.
if (network == 'mainnet') {
  port = 10332;
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
var neoNodes = neoSeeds.map(function(domain){
  return domain + ':' + port;
});

//build the list of CoZ maintained nodes
var cozNodes = [1,2,3,4,5].map(function(i){
  return 'http://' + cozNetwork + i + '.cityofzion.io:8080';
});

//export the node list
exports.nodes = neoNodes.concat(cozNodes);

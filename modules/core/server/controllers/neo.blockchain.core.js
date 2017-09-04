var conf = require ('./neo.blockchain.conf');

function neo(){
  //load the bootstrap configuration data
  var conf = require ('./neo.blockchain.conf');
  this.nodes = conf.nodes;


  //updates this.nodes with the current block height.
  this.updateBlockCount = function(){
    return new Promise(function(resolve, reject){

      var ret = 0;
      conf.nodes.forEach(function(node){
        node.node.call({
          method: "getblockcount",
          params: [],
          id: 0})
          .then(function(data){
            node.blockHeight = data.result;
            node.latency = data.latency;
            node.active = true;
            node.age = Date.now();
          })
          .catch(function(err){
            node.active = false;
            node.age = Date.now();
          })
          .then(function(){
            ret ++;
            if (ret == conf.nodes.length){
              resolve();
            }
          })
      })
    })
  };
  this.updateBlockCount();
}

var blockchainNeo = new neo();

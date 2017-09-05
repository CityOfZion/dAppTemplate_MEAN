module.exports = function(blockchain){
  var module = {};

  var async = require('async');

  var workerCount = 2;
  var maxQueueLength = 100;

  var queue = async.queue(function(block, callback) {
    module.storeBlock(block)
      .then(function(){
        console.log('Synced: ' + block);
      });
    callback()
  }, workerCount);

  var async = require('async');

  module.start = function(){

  }

  module.stop = function(){

  }

  module.setWorkers = function(){

  }

  module.storeBlock = function(index){
    return new Promise(function(resolve, reject) {
      blockchain.rpc.getBlock(index)
        .then(function (res) {
          var block = blockchain.db.blocks(res);
          block.save(function (err) {
            if (err) return reject(err);
            resolve();
          })
        })
        .catch(function(err){
          reject(err);
        })
    });
  };

  module.checkBlocks = function(){

    var nextBlock = 0;
    var remoteHeight = 0;
    var addNumber = 0;

    blockchain.db.blocks.findOne({}, 'index')
      .sort('-index')
      .exec(function (err, res) {
        if (!res) res = {'index': -1};
        remoteHeight = blockchain.highestNode().blockHeight;
        nextBlock = res.index + 1;

        if (nextBlock <= remoteHeight){
          addNumber = Math.min(maxQueueLength - queue.length(), remoteHeight - (nextBlock - 1));
          for (var i = 0; i <= addNumber; i++){
            queue.push(nextBlock + i, function(){});
          }
        }
      });

  };


  return module
};

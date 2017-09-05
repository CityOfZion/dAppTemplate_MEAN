/**
 * @ngdoc controller
 * @name neo.blockchain.core
 * @requires lodash
 * @requires neo.blockchain.conf
 * @description
 * A controller which defines the neo blockchain prototype.
 */

function neo(){
  //load the bootstrap configuration data
  var _ = require('lodash');
  var conf = require('./neo.blockchain.conf');
  this.nodes = conf.nodes;
  var blockchain = this;

  this.getBalance = function(asset_id, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "getbalance",
        params: [],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.getBalance(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  this.getBestBlockHash = function(node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "getbestblockhash",
        params: [],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.getBestBlockHash(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  /**
   * @ngdoc method
   * @name getBlock
   * @methodOf neo.blockchain.core
   * @description
   * Invokes the getblock rpc request to return a block.  This method
   * accepts and optional node to request the block from.  If a node is not selected,
   * the fastest node will be used with failover in an attempt to guarantee a response.
   *
   * @param {Number} index The index of the block being requested.
   * @param {node} [node] The node to request the block from.
   * @returns {Promise} A promise returning the hex contents of the block
   */
  this.getBlock = function(index, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }
      if (!node){
        reject('Could not identify an active node');
      }

      node.call({
        method: "getblock",
        params: [index],
        id: 0})
        .then(function(data){
          resolve(data.result);
        })
        .catch(function(){
          if (failOver) {
            blockchain.getBlock(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function(err){
                reject(err);
              })
          }
          else{
            reject({'message': 'Could not connect to the requested server'})
          }
        });
    })
  };

  /**
   * @ngdoc method
   * @name getBlockCount
   * @methodOf neo.blockchain.core
   * @description
   * Invokes the getblockcount rpc request to return the block height.  This
   * method will request the block height from the fastest active node with failover if a
   * node is not provided.  This method will update the blockHeight attribute
   * on the node it is run on.
   *
   * @param {node} [node] The node that will be polled for its block height.
   * @returns {Promise} A promise returning the block count.
   */
  this.getBlockCount = function(node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "getblockcount",
        params: [],
        id: 0
      })
      .then(function (data) {
        node.blockHeight = data.result;
        resolve(data.result);
      })
      .catch(function (err) {
        if (failOver) {
          blockchain.getBlockCount(index)
            .then(function (data) {
              resolve(data);
            })
            .catch(function (err) {
              reject(err);
            })
        }
        else {
          reject({"message": "Unable to contact the requested node."})
        }
      })
    })
  };

  /**
   * @ngdoc method
   * @name getBlockHash
   * @methodOf neo.blockchain.core
   * @description
   * Invokes the getblockhash rpc request to return a block's hash.  This method
   * accepts and optional node to request the block from.  If a node is not selected,
   * the fastest node will be used with failover in an attempt to guarantee a response.
   *
   * @param {Number} index The index of the block hash being requested.
   * @param {node} [node] The node to request the block from.
   * @returns {Promise} A promise returning the hash of the block
   */
  this.getBlockHash = function(index, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }
      if (!node){
        reject('Could not identify an active node');
      }

      node.call({
        method: "getblockhash",
        params: [index],
        id: 0})
        .then(function(data){
          resolve(data.result);
        })
        .catch(function(){
          if (failOver) {
            blockchain.getBlockHash(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function(err){
                reject(err);
              })
          }
          else{
            reject({'message': 'Could not connect to the requested server'})
          }
        });
    })
  };

  /**
   * @ngdoc method
   * @name getConnectionCount
   * @methodOf neo.blockchain.core
   * @description
   * Invokes the getconnectioncount rpc request to return the number of connections to
   * the selected node.
   *
   * @param {node} node The node to request the connections of.
   * @returns {Promise} A promise returning the number of connections to the node.
   */
  this.getConnectionCount = function(node){
    return new Promise(function(resolve, reject){
      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "getconnectioncount",
        params: [],
        id: 0
      })
        .then(function (data) {
          node.connections = data.result;
          resolve(data.result);
        })
        .catch(function (err) {
            reject({"message": "Unable to contact the requested node."})
        })
    })
  };

  this.getRawMemPool = function(node){
    return new Promise(function(resolve, reject){
      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "getrawmempool",
        params: [],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          reject({"message": "Unable to contact the requested node."})
        })
    })
  };

  this.getRawTransaction = function(txid, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "getrawtransaction",
        params: [txid],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.getRawTransaction(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  this.getTXOut = function(txid, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "gettxout",
        params: [txid],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.getTXOut(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  this.sendRawTransaction = function(hex, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "sendrawtransaction",
        params: [hex],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.sendRawTransaction(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  this.sendToAddress = function(asset_id, address, value, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "sendtoaddress",
        params: [asset_id, address, value],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.sendToAddress(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  this.submitBlock = function(hex, node){
    return new Promise(function(resolve, reject){
      var failOver = false;
      if (!node){
        node = fastestNode();
        failOver = true;
      }

      if (!node){
        reject({"message": "Could not identify an active node"});
      }

      node.call({
        method: "submitblock",
        params: [hex],
        id: 0
      })
        .then(function (data) {
          resolve(data.result);
        })
        .catch(function (err) {
          if (failOver) {
            blockchain.submitBlock(index)
              .then(function (data) {
                resolve(data);
              })
              .catch(function (err) {
                reject(err);
              })
          }
          else {
            reject({"message": "Unable to contact the requested node."})
          }
        })
    })
  };

  /**
   * @ngdoc method
   * @name updateBlockCount
   * @methodOf neo.blockchain.core
   * @description
   * Polls registered nodes to update their status including whether they are active
   * and what their current block height is.  A fraction of the nodes are randomly selected for update
   * as a way to reduce polling traffic.
   *
   * @returns {Promise}
   */
  this.updateBlockCount = function() {
    return new Promise(function (resolve) {

      var ret = 0;
      var updateCount = 10;

      var used = [];
      var selection = 0;
      while (used.length < updateCount) {
        selection = Math.floor(Math.random() * (blockchain.nodes.length));
        if (used.indexOf(selection) != -1) {
          continue;
        }
        used.push(selection);
        blockchain.getBlockCount(blockchain.nodes[selection])
          .catch(function (err) {
          })
          .then(function(){
            ret++;
            if (ret == updateCount) {
              resolve();
            }
          })
      }
    });
  };
  //this.updateBlockCount();

  function fastestNode(){
    var activeNodes = _.filter(blockchain.nodes, 'active');
    return _.minBy(activeNodes, 'latency');
  }
}

exports.neo = neo;



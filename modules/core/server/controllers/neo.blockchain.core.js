/**
 * @ngdoc controller
 * @name neo.blockchain.core
 * @requires lodash
 * @requires neo.blockchain.conf
 * @description
 * A controller which defines the neo blockchain prototype.
 * @param {String} mode sets whether the library should run in full or light mode.
 * Options: 'full' , 'light'
 */

function neo(mode, network){
  //load the bootstrap configuration data
  var _ = require('lodash');

  this.nodes = require('./neo.blockchain.conf')(network).nodes;
  this.rpc = require('./neo.blockchain.rpc')(this);
  this.mode = mode;

  var blockchain = this;

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
        blockchain.rpc.getBlockCount(blockchain.nodes[selection])
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

  /**
   * @ngdoc method
   * @name fastestNode
   * @methodOf neo.blockchain.core
   * @description
   * Identifies and returns the fastest node based on the latency of the last transaction.
   *
   * @returns {node}
   */
  this.fastestNode = function(){
    var activeNodes = _.filter(blockchain.nodes, 'active');
    return _.minBy(activeNodes, 'latency');
  }
}

exports.neo = neo;



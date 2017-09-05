'use strict';

  var path = require('path'),
  config = require(path.resolve('./config/config')),
  neo = require('./neo.blockchain.core.js');
/**
 * Render the main application page
 */

var blockchainNeo = new neo.neo();

blockchainNeo.updateBlockCount().then(function(){
  blockchainNeo.getBestBlockHash().then(function(res){
    console.log(res)
  })
});

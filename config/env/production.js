'use strict';

var fs = require('fs');

module.exports = {
  blockchain: {
    neo: {network: 'mainnet'}
  },
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  port: process.env.PORT || 8443,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
    options: {
      /**
      * Uncomment to enable ssl certificate based authentication to mongodb
      * servers. Adjust the settings below for your specific certificate
      * setup.
      * for connect to a replicaset, rename server:{...} to replset:{...}

      ssl: true,
      sslValidate: false,
      checkServerIdentity: false,
      sslCA: fs.readFileSync('./config/sslcerts/ssl-ca.pem'),
      sslCert: fs.readFileSync('./config/sslcerts/ssl-cert.pem'),
      sslKey: fs.readFileSync('./config/sslcerts/ssl-key.pem'),
      sslPass: '1234'

      */
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    collections: [{
      model: 'User',
      docs: [{
        data: {
          username: 'local-admin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }]
    }]
  }
};

var assert = require("assert")
    , utils = require('../utils')
    , moment = require('moment')
    , config = {};

/**
 * Loading configuration
 */
switch(process.env.NODE_ENV) {
    case 'development':
        config = exports.config = require('../config-dev.json');
        break;
    case 'production':
        config = exports.config = require('../config-prod.json');
        break;
    default:
        if(typeof process.env.NODE_ENV == 'undefined') {
            config = exports.config = require('../config-dev.json');
            process.env.NODE_ENV = 'development';
        }
        break;
}
domain = 'http://'+config.app.domain+':'+config.app.port;
console.log('Environment set to: '+process.env.NODE_ENV);
console.log('Domain set to:'+domain);

/**
 * Database Connection
 */
var dbConex = exports.dbConex = utils.dbConnection(config.db.domain,config.db.name,config.db.user,config.db.pass);


console.log('Database Test ends');

// Define globals here
var Player, Administrators;

/**
 * Test entities creation
 */
describe('Test Database Entities Creation', function(){

    before(function(){
        //Before all tests
        Player = require("../models/players.js");
        Administrators = require("../models/administrators.js");
    });

    describe('Create Administrator', function(){
        it('db should create a new administrator in the database', function(done){
          var administrator = new Administrators({
              identity        : "admin-sample",
              username        : "admin",
              role            : "admin",
              name            : "Cristian",
              email           : "cortez.cristian@gmail.com",
              hashed_password : "123456",
              created         : Date.now(),
              last_login      : Date.now(),
              gender          : 'M',
              location        : "-32.953701,-60.657375",
              language        : "es",
              connected       : true,
              nLogins         : 1
          });
        administrator.save(done);

        })
    });
});

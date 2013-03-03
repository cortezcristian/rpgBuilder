var Browser = require("zombie")
  , assert = require("assert")
  , utils = require('../utils')
  , config = {}
  , browser = new Browser()
  , domain = ""
  , mongoose = require('../node_modules/mongoose');

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
var Administrators;

/**
* Test Authentication Login
*/
describe('Test Authentication Login', function(){

    before(function(){
        Administrators = require("../models/administrators.js");
        //Before all tests
        Administrators.findOne({ "email":"cortez.cristian@gmail.com"}, function(err, user) {
          if (err) { return err; }
          if (!user) {
              //If this user does not exists: We create it cause we need it for the test
              var admin = new Administrator({
                  identity      : "crisboot-photon-test",
                  username      : "crisboot",
                  name          : "Cristian",
                  email         : "cortez.cristian@gmail.com.com",
                  hashed_password   : "123456",
                  created       : Date.now(),
                  last_login    : Date.now(),
                  gender        : 'M',
                  location      : "-32.953701,-60.657375",
                  language      : "es",
                  playing       : true,
                  nLogins       : 111
              });

              admin.save();
          }
                    
        });
    });

    describe('Login Test', function(){
        it('should successful authenticate one administrator in the system', function(done){
            var complete = false, success = false;

            browser.visit(domain+"/admin", function () {
                 assert.ok(browser.success);   
                 browser.
                   fill("email", "cortez.cristian@gmail.com").
                   fill("password", "123456").
                   pressButton("Log In", function() {
                       assert.ok(browser.success);
                       if(browser.location.pathname == "/panel"){
                          success = true;    
                       }

                       complete = true;
                   });
            });
            
            (function(){
                if(!complete){
                    setTimeout(arguments.callee, 30);
                    return;
                }
                if(success){
                    done();
                }else{
                    var err = new Error("Login Failed");
                    done(err);
                }
            })();
        });
    })
});

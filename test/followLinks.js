var Browser = require("zombie")
  , assert = require("assert")
  , config = {}
  , browser, domain = "";

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
console.log('Domain set to: http://'+domain);

/**
* Test relationships between pages
*/

describe('Follow Links', function(){

    before(function(){
        browser = new Browser();    
    });

    describe('GET /', function(){
        it('should return OK if Home Page is present', function(){
            browser.visit(domain+"/", function () {
                 assert.ok(browser.success);   
                 console.log(browser.document.location);
                 done();
            });
        })
    })
});

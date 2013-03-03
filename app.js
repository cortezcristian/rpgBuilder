
/**
 * Module dependencies.
 */

var express = require('express')
  , expressValidator = require('express-validator')
  , flash = require('connect-flash')
  , utils = require('./utils')
  , http = require('http')
  , path = require('path')
  , i18n = require('i18n')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , MongoStore = require('connect-mongo')(express)
  , config = {};

/**
 * Loading configuration
 */
switch(process.env.NODE_ENV) {
    case 'development':
        config = exports.config = require('./config-dev.json');
    break;
    case 'production':
        config = exports.config = require('./config-prod.json');
    break;
    default:
        if(typeof process.env.NODE_ENV == 'undefined') {
            config = exports.config = require('./config-dev.json');
            process.env.NODE_ENV = 'development';
        }
    break;
}
console.log('Environment set to:'+process.env.NODE_ENV);
console.log('http://'+config.app.domain+':'+config.app.port+'/');

/**
* Database Connection
*/
var dbConex = exports.dbConex = utils.dbConnection(config.db.domain,config.db.name,config.db.user,config.db.pass);

/**
* Passport Auth Strategy
*/
require('./authpassport');

/**
* Express App
*/
var app = exports.app = express();

/**
* Localization
*/
i18n.configure({
    locales:['en'],
});

app.locals({
  __i: i18n.__,
  __n: i18n.__n
});

app.configure(function(){
  app.set('port', process.env.PORT || config.app.port || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(expressValidator);
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.session.secret));
  app.use(express.session({secret:config.session.secret,store : new MongoStore({
    url: utils.dbConnectionString(config.db.domain,config.db.name,config.db.user,config.db.pass),
  })}));
  app.use(i18n.init);
  app.use(passport.initialize());
  app.use(passport.session())
  app.use(flash());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));

  //Setting Locals
  //app.locals;
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
* Routes
*/
require('./routes/main');

/**
* Passport Auth
*/
require('./routes/auth');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

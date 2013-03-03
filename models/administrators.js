var mongoose = require('../node_modules/mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , enumGender = ['F','M','U'];
  
var administratorSchema = new Schema({
	identity        : String,      
	username        : String,     
	role            : String,     
	name            : String,
    email           : { type: String, set: toLower },
    hashed_password : String,
    salt            : String,
	created         : Date,         
	last_login      : Date,          
	gender          : { type    : String,
						enum    : enumGender,
						default : 'U'},
	location      : String,
	language      : String,
	connected       : Boolean,
	nLogins       : Number
});

administratorSchema.statics.findByUsername = function (username, cb) {
      this.find({ name: new RegExp(username, 'i') }, cb);
}

function toLower (v) {
    return v.toLowerCase();
}

administratorSchema.pre('save', function(next) {
    this._password = this.hashed_password;
    if (!this.isModified('hashed_password')) return next();
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(this._password, this.salt);
    next();

  });

administratorSchema.method('encryptPassword', function(password) {
    return crypto.createHmac('md5', this.salt).update(password).digest('hex');
});

administratorSchema.method('authenticate', function(password) {
    return this.encryptPassword(password) === this.hashed_password;
});

administratorSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
});


module.exports = mongoose.model('Administrator', administratorSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const collname = 'users';  // collection name in db
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    email: {type: String, default: ''},
    phoneNumber: {type: String, default: ''},
    password: {type: String, default: ''},
    isDeleted: {type: Boolean, default: false},
});


UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const user = mongoose.model('User', UserSchema, collname);

module.exports = user;
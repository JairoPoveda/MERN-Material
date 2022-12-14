const mongoose = require('mongoose');
const collname = 'users';  // collection name in db
const Schema = mongoose.Schema;

const UserSessionSchema = new Schema({
    userId: {type: String, default: ''},
    timestamp: {type: Date, default: Date.now()},
    isDeleted: {type: Boolean, default: false},
});

const user = mongoose.model('UserSession', UserSessionSchema);

module.exports = user;
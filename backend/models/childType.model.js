const mongoose = require('mongoose');
const collname = 'mern';  // collection name in db
const Schema = mongoose.Schema;

const typeSchema = new Schema({
  ChildType: {type: String, required: true, trim: true},  
}, {
  timestamps: true,
});

const ChildType = mongoose.model('ChildType', typeSchema, collname);

module.exports = ChildType;
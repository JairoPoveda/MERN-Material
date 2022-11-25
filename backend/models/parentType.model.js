const mongoose = require('mongoose');
const collname = 'mern';  // collection name in db
const Schema = mongoose.Schema;

const typeSchema = new Schema({
  ParentType: {type: String, required: true, trim: true},  
}, {
  timestamps: true,
});

const ParentType = mongoose.model('ParentType', typeSchema, collname);

module.exports = ParentType;
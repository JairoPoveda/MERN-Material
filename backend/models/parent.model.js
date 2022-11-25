const mongoose = require('mongoose');
const collname = 'mern';  // collection name in db
const Schema = mongoose.Schema;

const parentSchema = new Schema({
  ParentSellerID: {type: Number, required: true, trim: true},
  ParentType: {type: String, required: true, trim: true},
  ParentSellerName: {type: String, required: true, trim: true},
  ParentGeographyID: {type: String, required: true, trim: true},
  ParentGeographyName: {type: String, required: true, trim: true},

  TotalNS90: {type: Number, required: true, trim: true},
  NS90: {type: Number, required: true, trim: true},  
}, {
  timestamps: true,
});

const Parent = mongoose.model('Parent', parentSchema, collname);

module.exports = Parent;
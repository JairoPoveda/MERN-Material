const mongoose = require('mongoose');
const collname = 'mern';  // collection name in db
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  ChildSellerID: {type: Number, required: true, unique: true, trim: true},
  ChildSellerName: {type: String, required: true, trim: true},
  ChildType: {type: String, required: true, trim: true},  
  ChildGeographyID: {type: String, required: true, trim: true},
  ChildGeographyName: {type: String, required: true, trim: true}, 
  
  ParentSellerID: {type: Number, required: true, trim: true},
  ParentSellerName: {type: String, required: true, trim: true},
  ParentType: {type: String, required: true, trim: true},  
  ParentGeographyID: {type: String, required: true, trim: true},
  ParentGeographyName: {type: String, required: true, trim: true},

  TotalNS90: {type: Number, required: true, trim: true},
  NS90: {type: Number, required: true, trim: true},
}, {
  timestamps: true,
});

const Seller = mongoose.model('Seller', sellerSchema, collname);

module.exports = Seller;
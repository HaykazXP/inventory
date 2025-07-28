const mongoose = require('mongoose');

const sellingPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  checkout: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SellingPoint', sellingPointSchema); 
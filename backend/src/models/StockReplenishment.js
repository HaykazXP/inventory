const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockReplenishmentSchema = new Schema({
  sellingPointId: {
    type: Schema.Types.ObjectId,
    ref: 'SellingPoint',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const StockReplenishment = mongoose.model('StockReplenishment', stockReplenishmentSchema);

module.exports = StockReplenishment;

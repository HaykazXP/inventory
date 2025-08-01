const mongoose = require('mongoose');
const { Schema } = mongoose;

const sellingPointSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  inventory: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }
  ],
  inventoryTotalValue: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const SellingPoint = mongoose.model('SellingPoint', sellingPointSchema);

module.exports = SellingPoint;

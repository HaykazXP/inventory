const mongoose = require('mongoose');
const { Schema } = mongoose;

const weeklyInventorySchema = new Schema({
  sellingPointId: {
    type: Schema.Types.ObjectId,
    ref: 'SellingPoint',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  inventoryItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      previousQuantity: {
        type: Number,
        required: true
      },
      currentQuantity: {
        type: Number,
        required: true
      },
      soldQuantity: {
        type: Number,
        required: true
      },
      soldValue: {
        type: Number,
        required: true
      }
    }
  ],
  totalSoldValue: {
    type: Number,
    required: true
  },
  weekSalesTotal: {
    type: Number,
    required: true
  },
  discrepancy: {
    type: Number,
    required: true
  },
  hasDiscrepancy: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const WeeklyInventory = mongoose.model('WeeklyInventory', weeklyInventorySchema);

module.exports = WeeklyInventory;

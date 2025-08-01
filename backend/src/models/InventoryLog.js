const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventoryLogSchema = new Schema({
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
  changeType: {
    type: String,
    enum: ['addition', 'subtraction', 'adjustment'],
    required: true
  },
  oldValue: {
    type: Number,
    required: true,
    min: 0
  },
  newValue: {
    type: Number,
    required: true,
    min: 0
  },
  countChange: {
    type: Number,
    required: true
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

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);

module.exports = InventoryLog;
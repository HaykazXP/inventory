const mongoose = require('mongoose');
const { Schema } = mongoose;

const salesSchema = new Schema({
  sellingPointId: {
    type: Schema.Types.ObjectId,
    ref: 'SellingPoint',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  cashSales: {
    type: Number,
    required: true,
    default: 0
  },
  nonCashSales: {
    type: Number,
    required: true,
    default: 0
  },
  totalSales: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

salesSchema.pre('save', function(next) {
  this.totalSales = this.cashSales + this.nonCashSales;
  next();
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const cashWithdrawalSchema = new Schema({
  sellingPointId: {
    type: Schema.Types.ObjectId,
    ref: 'SellingPoint',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    default: 'Снятие наличных средств'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const CashWithdrawal = mongoose.model('CashWithdrawal', cashWithdrawalSchema);

module.exports = CashWithdrawal;
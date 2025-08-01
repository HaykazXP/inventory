const mongoose = require('mongoose');
const { Schema } = mongoose;

const nonCashWithdrawalSchema = new Schema({
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
    default: 'Снятие безналичных средств'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const NonCashWithdrawal = mongoose.model('NonCashWithdrawal', nonCashWithdrawalSchema);

module.exports = NonCashWithdrawal;
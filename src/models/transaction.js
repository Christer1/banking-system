const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

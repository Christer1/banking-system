const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

const bankAccountSchema = new mongoose.Schema({
  accountNumber: Number,
  firstName: String,
  lastName: String,
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema]
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
module.exports = BankAccount;

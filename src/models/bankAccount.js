const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  accountNumber: { type: Number, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  accountHolder: { type: String, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

// Middleware to generate a unique account number before saving
bankAccountSchema.pre('save', async function(next) {
  if (!this.accountNumber) {
    const highestAccountNumber = await BankAccount.findOne().sort('-accountNumber');
    this.accountNumber = highestAccountNumber ? highestAccountNumber.accountNumber + 1 : 1000000000;
  }
  next();
});

// Middleware to set accountHolder as the combination of firstName and lastName
bankAccountSchema.pre('validate', function(next) {
  this.accountHolder = `${this.firstName} ${this.lastName}`;
  next();
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;

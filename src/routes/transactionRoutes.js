const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');
const Transaction = require('../models/transaction');

// Fetch all transactions for an account
router.get('/accounts/:id/transactions', async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    res.json(account.transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deposit money
router.post('/accounts/:id/deposit', async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    const transaction = new Transaction({
      type: 'deposit',
      amount: req.body.amount,
      timestamp: new Date()
    });

    account.transactions.push(transaction);
    account.balance += req.body.amount;

    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Withdraw money
router.post('/accounts/:id/withdraw', async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });

    if (account.balance < req.body.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      type: 'withdrawal',
      amount: req.body.amount,
      timestamp: new Date()
    });

    account.transactions.push(transaction);
    account.balance -= req.body.amount;

    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Transfer between accounts
router.post('/accounts/:id/transfer', async (req, res) => {
  try {
    const sourceAccount = await BankAccount.findById(req.params.id);
    const targetAccount = await BankAccount.findById(req.body.toAccountId);

    if (!sourceAccount) {
      return res.status(404).json({ message: 'Source account not found' });
    }

    if (!targetAccount) {
      return res.status(404).json({ message: 'Target account not found' });
    }

    if (sourceAccount.balance < req.body.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawal = new Transaction({
      type: 'withdrawal',
      amount: req.body.amount,
      timestamp: new Date()
    });

    const deposit = new Transaction({
      type: 'deposit',
      amount: req.body.amount,
      timestamp: new Date()
    });

    sourceAccount.transactions.push(withdrawal);
    sourceAccount.balance -= req.body.amount;

    targetAccount.transactions.push(deposit);
    targetAccount.balance += req.body.amount;

    await sourceAccount.save();
    await targetAccount.save();

    res.status(201).json({ sourceAccount, targetAccount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

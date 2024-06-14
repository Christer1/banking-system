const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');
const Transaction = require('../models/transaction');

// Fetch all transactions for an account
router.get('/:id/transactions', async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id).populate('transactions');
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account.transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deposit money into an account
router.post('/:id/deposit', async (req, res) => {
  const { amount } = req.body;

  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.balance += amount;
    const transaction = new Transaction({ type: 'deposit', amount });
    account.transactions.push(transaction);

    await transaction.save();
    await account.save();

    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Withdraw money from an account
router.post('/:id/withdraw', async (req, res) => {
  const { amount } = req.body;

  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    account.balance -= amount;
    const transaction = new Transaction({ type: 'withdrawal', amount });
    account.transactions.push(transaction);

    await transaction.save();
    await account.save();

    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transfer money between accounts
router.post('/:id/transfer', async (req, res) => {
  const { toAccountId, amount } = req.body;

  try {
    const fromAccount = await BankAccount.findById(req.params.id);
    const toAccount = await BankAccount.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ error: 'One or both accounts not found' });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    const withdrawal = new Transaction({ type: 'withdrawal', amount });
    const deposit = new Transaction({ type: 'deposit', amount });

    fromAccount.transactions.push(withdrawal);
    toAccount.transactions.push(deposit);

    await withdrawal.save();
    await deposit.save();
    await fromAccount.save();
    await toAccount.save();

    res.status(200).json({ fromAccount, toAccount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

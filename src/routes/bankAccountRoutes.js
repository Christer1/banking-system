const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');

// Create a new bank account
router.post('/', async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    // Check if an account with the same name already exists
    const existingAccount = await BankAccount.findOne({ firstName, lastName });
    if (existingAccount) {
      return res.status(400).json({ error: 'An account with this name already exists.' });
    }

    const newAccount = new BankAccount({ firstName, lastName });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await BankAccount.find();
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a single account by ID
router.get('/:id', async (req, res) => {
  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an account
router.delete('/:id', async (req, res) => {
  try {
    const account = await BankAccount.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an account
router.put('/:id', async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    const account = await BankAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if an account with the new name already exists
    const existingAccount = await BankAccount.findOne({ firstName, lastName });
    if (existingAccount && existingAccount.id !== req.params.id) {
      return res.status(400).json({ error: 'An account with this name already exists.' });
    }

    account.firstName = firstName;
    account.lastName = lastName;
    await account.save();
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bankAccount');


//create account
router.post('/accounts', async (req, res) => {
  const { accountNumber, firstName, lastName, initialBalance } = req.body;
  const newAccount = new BankAccount({ accountNumber, firstName, lastName, balance: initialBalance });
  await newAccount.save();
  res.status(201).send(newAccount);
});

//fetch all accounts
router.get('/accounts', async (req, res) => {
  const accounts = await BankAccount.find();
  res.status(200).send(accounts);
});

//fetch single account
router.get('/accounts/:id', async (req, res) => {
  const account = await BankAccount.findById(req.params.id);
  res.status(200).send(account);
});

//update account
router.put('/accounts/:id', async (req, res) => {
  const account = await BankAccount.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(account);
});

//delete account
router.delete('/accounts/:id', async (req, res) => {
  await BankAccount.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: 'Account deleted' });
});

module.exports = router;

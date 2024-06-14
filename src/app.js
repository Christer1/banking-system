const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const bankAccountRoutes = require('./routes/bankAccountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/accounts', bankAccountRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;

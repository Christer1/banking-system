const express = require('express');
const app = express();
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use(express.json());

app.use('/api', bankAccountRoutes);
app.use('/api', transactionRoutes);

app.get('/', (req, res) => {
  res.send('Running..!');
});

module.exports = app;

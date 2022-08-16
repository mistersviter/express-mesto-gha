const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/', (req, res) => {
  res.status(404);
  res.send('<h1>Страница не найдена</h1>');
});

app.listen(PORT, () => {
});

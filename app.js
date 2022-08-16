const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.status(404);
  res.send('<h1>Страница не найдена</h1>');
});

app.listen(PORT, () => {
});

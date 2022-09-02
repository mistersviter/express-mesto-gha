const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const { ERROR_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/[www]?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Ой, такого пути не существует' });
});

app.listen(PORT);

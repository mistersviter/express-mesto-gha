const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        const regex = /https?:\/\/[www]?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/i;
        if (!regex.test(link)) {
          throw new Error(`${link} Некорректная ссылка`);
        }
        return true;
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        if (!isEmail(email)) {
          throw new Error('Некорректный формат почты');
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

const rejectInvalidCredentials = () => Promise.reject(new Error('Неправильные почта или пароль'));

userSchema.statics.findUserByCredentials = function checkEmail(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return rejectInvalidCredentials;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return rejectInvalidCredentials;
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

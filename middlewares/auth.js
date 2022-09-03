const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorizationError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  req.user = payload;
  return next();
};

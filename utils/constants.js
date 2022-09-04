const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;
const SALT_ROUNDS = 10;
const JWT_SECRET = 'someverysecretkey';
const REGEX = /https?:\/\/[www]?\.?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]+/i;

module.exports = {
  ERROR_NOT_FOUND,
  ERROR_BAD_REQUEST,
  ERROR_DEFAULT,
  SALT_ROUNDS,
  JWT_SECRET,
  REGEX,
};

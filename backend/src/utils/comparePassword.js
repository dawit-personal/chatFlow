const bcrypt = require('bcrypt');

async function comparePassword(plainText, hashed) {
  return bcrypt.compare(plainText, hashed);
}

module.exports = comparePassword;

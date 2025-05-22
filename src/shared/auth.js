const jwt = require('jsonwebtoken');
const SECRET = 'my-secret';

function getUserFromToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { getUserFromToken };

const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

const SECRET = 'my-secret';

function getUserFromToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function isAuthorized(user, allowedRoles) {
  if (!user || !allowedRoles.includes(user.role)) {
    throw new GraphQLError('Unauthorized access', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
}

module.exports = { getUserFromToken, isAuthorized };

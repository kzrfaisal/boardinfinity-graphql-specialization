const { GraphQLScalarType, Kind } = require('graphql');

function validateEmail(value) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!isValid) throw new TypeError(`Invalid email: ${value}`);
  return value;
}

const EmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'Custom scalar for validating email addresses',
  serialize: validateEmail,
  parseValue: validateEmail,
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return validateEmail(ast.value);
    }
    throw new TypeError('Email must be a string');
  },
});

module.exports = {
  EmailScalar,
  EmailTypeDef: `scalar Email`,
};

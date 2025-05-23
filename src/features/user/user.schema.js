const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./user.graphql');
const resolvers = require('./user.resolver');

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});

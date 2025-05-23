const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('./address.graphql');
const resolvers = require('./address.resolver');

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});

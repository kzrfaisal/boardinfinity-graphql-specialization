const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('.'); // Loads all .graphql files via schema.js
const resolvers = require('../resolvers'); // Merged resolvers from features and shared

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const path = require('path');
const resolvers = require('./resolvers');

const typesArray = loadFilesSync(path.join(__dirname, './schema'), {
  extensions: ['graphql'],
});
const typeDefs = mergeTypeDefs(typesArray);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;

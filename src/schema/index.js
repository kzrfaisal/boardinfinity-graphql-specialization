const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typesArray = loadFilesSync(__dirname, { extensions: ['graphql'] });
const typeDefs = mergeTypeDefs(typesArray);

module.exports = typeDefs;

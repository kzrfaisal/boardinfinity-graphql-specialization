// schema/index.js
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const path = require('path');

const typeArrays = loadFilesSync(
  path.join(__dirname, '../features/**/*.graphql')
).concat(loadFilesSync(path.join(__dirname, '../shared/**/*.graphql')));
const typeDefs = mergeTypeDefs(typeArrays);

module.exports = typeDefs;

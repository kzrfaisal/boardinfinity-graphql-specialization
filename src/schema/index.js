// schema/index.js
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const path = require('path');
const { EmailTypeDef } = require('../shared/email.scalar');

const typeDefs = mergeTypeDefs([
  EmailTypeDef,
  ...loadFilesSync(path.join(__dirname, '../features/**/*.graphql')),
  ...loadFilesSync(path.join(__dirname, '../shared/**/*.graphql')),
]);

module.exports = typeDefs;

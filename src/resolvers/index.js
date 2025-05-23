const { mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');
const { EmailScalar } = require('../shared/email.scalar');

module.exports = mergeResolvers([
  ...loadFilesSync(path.join(__dirname, '../features/**/*.resolver.js')),
  { Email: EmailScalar },
]);

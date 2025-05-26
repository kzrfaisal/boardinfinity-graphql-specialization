const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const {
  ApolloServerPluginUsageReportingDisabled,
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginSchemaReportingDisabled,
} = require('@apollo/server/plugin/disabled');

const resolvers = require('./user.resolver');
const typeDefs = loadFilesSync(__dirname + '/user.graphql');

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  plugins: [
    ApolloServerPluginUsageReportingDisabled(),
    ApolloServerPluginInlineTraceDisabled(),
    ApolloServerPluginSchemaReportingDisabled(),
  ],
});

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`🚀 User Subgraph ready at ${url}`);
});

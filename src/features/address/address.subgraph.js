const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { loadFilesSync } = require('@graphql-tools/load-files');
const {
  ApolloServerPluginUsageReportingDisabled,
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginSchemaReportingDisabled,
} = require('@apollo/server/plugin/disabled');

const typeDefs = loadFilesSync(__dirname + '/address.graphql');
const resolvers = require('./address.resolver');

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  plugins: [
    ApolloServerPluginUsageReportingDisabled(),
    ApolloServerPluginInlineTraceDisabled(),
    ApolloServerPluginSchemaReportingDisabled(),
  ],
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(({ url }) => {
  console.log(`🧩 Address Subgraph ready at ${url}`);
});

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const typeDefs = require('./schema'); // now loads merged schema
const resolvers = require('./resolvers');

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const logger = require('./logger');

const gateway = new ApolloGateway({
  debug: true,
  // supergraphSdl: new IntrospectAndCompose({
  //   subgraphs: [
  //     { name: 'users', url: 'http://localhost:4001/graphql' },
  //     { name: 'legacy', url: 'http://localhost:4005/graphql' },
  //   ],
  // }),
});

const server = new ApolloServer({
  gateway,
  formatError: (err) => {
    logger.error({
      message: err.message,
      code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
      service: err.extensions?.serviceName || 'unknown',
      path: err.path,
      timestamp: new Date().toISOString(),
    });

    return {
      message: err.message,
      code: err.extensions?.code,
    };
  },
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🌐 Gateway ready at ${url}`);
});

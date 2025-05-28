require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const rateLimit = require('express-rate-limit');
const { createLocationLoader } = require('./features/address/locationLoader');

const logger = require('./logger');
const schema = require('./schema/local.schema');
const { getUserFromToken } = require('./shared/auth');

const { PORT } = require('./config');

const limiter = rateLimit({
  windowMs: 10 * 1000, // ✅ 10 seconds
  max: 5, // ✅ max 5 requests per IP
  keyGenerator: (req) => req.headers['x-user-id'] || req.ip, // fallback to IP
});

async function startServer() {
  const app = express();
  app.use(limiter); // ✅ Limit applies globally to all HTTP requests

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token.replace('Bearer ', ''));
      return {
        user,
        loaders: {
          locationLoader: createLocationLoader(),
        },
      };
    },
    introspection: true,
    formatError: (err) => {
      logger.error({
        message: err.message,
        code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
        path: err.path,
        timestamp: new Date().toISOString(),
      });

      return {
        message: err.message,
        code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
    plugins: [
      {
        async requestDidStart() {
          return {
            async executionDidStart() {
              return {
                willResolveField({ info }) {
                  const fieldName = info.fieldName;
                  const start = Date.now();
                  return () => {
                    const duration = Date.now() - start;
                    // console.log(`⏱️ ${fieldName} took ${duration}ms`);
                  };
                },
              };
            },
          };
        },
      },
    ],
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  const httpServer = createServer(app);

  // ✅ Setup WebSocket for subscriptions
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: apolloServer.graphqlPath,
    }
  );

  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP ready at http://localhost:${PORT}/graphql`);
    console.log(`📡 Subscriptions ready at ws://localhost:${PORT}/graphql`);
  });
}

startServer();

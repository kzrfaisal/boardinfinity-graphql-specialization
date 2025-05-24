require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const schema = require('./schema/local.schema');
const { getUserFromToken } = require('./shared/auth');

const { PORT } = require('./config');

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token.replace('Bearer ', ''));
      return { user };
    },
    introspection: true,
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
                    console.log(`⏱️ ${fieldName} took ${duration}ms`);
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

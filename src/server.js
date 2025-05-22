const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const schema = require('./schema/local.schema');
const { getUserFromToken } = require('./shared/auth');

async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token.replace('Bearer ', ''));
      return { user };
    },
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

  httpServer.listen(4000, () => {
    console.log('🚀 HTTP ready at http://localhost:4000/graphql');
    console.log('📡 Subscriptions ready at ws://localhost:4000/graphql');
  });
}

startServer();

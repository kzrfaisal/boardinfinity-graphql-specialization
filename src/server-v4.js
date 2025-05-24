require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const responseCachePlugin =
  require('@apollo/server-plugin-response-cache').default;
const schema = require('./schema/local.schema');
const { getUserFromToken } = require('./shared/auth');

const { PORT } = require('./config');

const server = new ApolloServer({
  schema,
  introspection: true,
  cache: 'bounded',
  plugins: [
    responseCachePlugin(),
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

startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token.replace('Bearer ', ''));
    return { user };
  },
}).then(() => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});

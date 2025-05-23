const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { stitchSchemas } = require('@graphql-tools/stitch');
const localSchema = require('./schema/local.schema');
const createRemoteSchema = require('./schema/remote.schema');

async function startGateway() {
  const remoteSchema = await createRemoteSchema();

  const gatewaySchema = stitchSchemas({
    subschemas: [{ schema: localSchema }, { schema: remoteSchema }],
  });

  const server = new ApolloServer({
    schema: gatewaySchema,
  });

  startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(() => {
    console.log('Server ready at http://localhost:4000');
  });
}

startGateway();

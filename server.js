const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }
`;

// Data
const users = [
  { id: '1', name: 'Sarah' },
  { id: '2', name: 'Mike' },
];

// Resolvers
const resolvers = {
  Query: {
    user: (_, args) => {
      return users.find((u) => u.id === args.id);
    },
    users: () => users,
  },
};

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

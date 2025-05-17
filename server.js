const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type Book {
    title: String
  }

  type Query {
    book: Book
  }
`;

// Resolvers
const resolvers = {
  Query: {
    book: () => ({
      title: 'The Pragmatic Programmer',
      author: 'Andy Hunt',
    }),
  },
};

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type Book {
    title: String!
    author: Author
  }

  type Author {
    name: String!
  }

  type Query {
    book: Book
  }
`;

// Resolvers
const resolvers = {
  Query: {
    book: () => ({
      title: 'Refactoring',
      authorId: 'a1',
    }),
  },
  Book: {
    author: (parent) => {
      const authors = {
        a1: { name: 'Martin Fowler' },
        a2: { name: 'XYZ' },
      };
      return authors[parent.authorId];
    },
  },
};

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

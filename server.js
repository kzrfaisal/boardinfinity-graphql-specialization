const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }
`;

const books = [
  { id: '1', title: 'Refactoring', author: 'Martin Fowler' },
  { id: '2', title: 'Clean Code', author: 'Robert C. Martin' },
];

// Resolvers
const resolvers = {
  Query: {
    books: () => books,
    book: (_, args) => {
      return books.find((b) => b.id === args.id);
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

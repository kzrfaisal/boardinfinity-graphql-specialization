const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    books: [Book!]!
    user: User
  }
`;

const books = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: '2', title: '1984', author: 'George Orwell' },
];

const user = { id: 1, name: 'John', email: 'john@xyz.com', age: 21 };

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL!',
    books: () => books,
    user: () => user,
  },
};

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

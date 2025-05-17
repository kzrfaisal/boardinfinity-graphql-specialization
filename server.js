const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int
    price: Float
    inStock: Boolean
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
    book: Book
  }
`;

const books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    publishedYear: 1925,
    price: 400,
    inStock: true,
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    publishedYear: 1949,
    price: 450,
    inStock: false,
  },
];

const user = { id: 1, name: 'John', email: 'john@xyz.com', age: 21 };

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL!',
    books: () => books,
    user: () => user,
    book: () => books[0],
  },
};

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
   type Country {
    code: ID!
    name: String!
  }

  type Author {
    id: ID!
    name: String!
    country: Country
  }

  type Book {
    id: ID!
    title: String!
    publishedYear: Int
    author: Author
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }
`;

// Data
const books = [
  { id: '1', title: '1984', publishedYear: 1949, authorId: 'a1' },
  { id: '2', title: 'The Hobbit', publishedYear: 1937, authorId: 'a2' },
];

const authors = [
  { id: 'a1', name: 'George Orwell', countryCode: 'UK' },
  { id: 'a2', name: 'J.R.R. Tolkien', countryCode: 'UK' },
];

const countries = [
  { code: 'UK', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
];

// Resolvers

const resolvers = {
  Query: {
    books: () => books,
    book: (_, args) => {
      return books.find((b) => b.id === args.id);
    },
  },
  Book: {
    author: (parent) => authors.find((a) => a.id === parent.authorId),
  },
  Author: {
    country: (parent) => countries.find((c) => c.code === parent.countryCode),
  },
};

// Start server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log('Server ready at http://localhost:4000');
});

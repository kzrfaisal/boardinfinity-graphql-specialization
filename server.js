const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type User {
    id: ID!
    email: String!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    createUser(email: String!, password: String!): User!
  }
`;

// Data
const users = [
  { id: '1', email: 'sarah@xyz.com' },
  { id: '2', email: 'mike@xyz.com' },
];

let userIdCounter = 3;

// Resolvers
const resolvers = {
  Query: {
    user: (_, args) => {
      return users.find((u) => u.id === args.id);
    },
    users: () => users,
  },
  Mutation: {
    createUser: (_, { email, password }) => {
      // In real apps, you'd hash passwords and save to DB
      const newUser = {
        id: userIdCounter++,
        email,
      };
      users.push(newUser);
      return newUser;
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

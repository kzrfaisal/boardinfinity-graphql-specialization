const { GraphQLError } = require('graphql');
const pubsub = require('../../shared/pubsub');
const { isAuthorized } = require('../../shared/auth');
const { isAuthenticated } = require('../../shared/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Data
const users = [
  { id: '1', email: 'sarah@xyz.com', gender: 'FEMALE' },
  { id: '2', email: 'mike@xyz.com', gender: 'MALE' },
];

let userIdCounter = 3;

// Resolvers
const resolvers = {
  Query: {
    user: (_, args) => {
      return users.find((u) => u.id === args.id);
    },
    users: () => {
      console.log('🟡 users resolver called at', new Date().toISOString());
      return prisma.user.findMany();
    },
    me: (_, __, context) => {
      isAuthenticated(context.user);
      return context.user;
    },
  },
  Mutation: {
    createUser: (_, { input }, context) => {
      let { email, password, gender } = input;
      isAuthenticated(context.user);

      // ✅ Basic validation
      if (!email || !password) {
        throw new GraphQLError('Email and password are required.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'email',
          },
        });
      }

      // ✅ Sanitization steps
      email = email.trim().toLowerCase(); // Normalize casing
      password = password.trim(); // Remove extra spaces
      gender = gender?.toUpperCase(); // Ensure enum consistency if coming from raw input

      if (password.length < 8) {
        throw new GraphQLError('Password must be at least 8 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'password',
            minLength: 8,
          },
        });
      }

      // In real apps, you'd hash passwords and save to DB
      const newUser = prisma.user.create({
        data: {
          email,
          gender,
        },
      });
      users.push(newUser);

      pubsub.publish('USER_CREATED', {
        userCreated: newUser,
      });

      return newUser;
    },
    updateUser: (_, { input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) {
        throw new Error('User not found.');
      }

      if (input.email) {
        user.email = input.email;
      }

      return user;
    },
    deleteUser: (_, { id }, context) => {
      isAuthorized(context.user, ['admin']);

      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error('User not found.');
      }
      users.splice(index, 1);
      return true;
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterableIterator('USER_CREATED'),
    },
  },
};

module.exports = resolvers;

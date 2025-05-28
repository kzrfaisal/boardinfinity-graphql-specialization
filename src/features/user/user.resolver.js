const { GraphQLError } = require('graphql');
const pubsub = require('../../shared/pubsub');
const { isAuthorized } = require('../../shared/auth');
const { isAuthenticated } = require('../../shared/auth');
const { PrismaClient } = require('@prisma/client');
const { ApolloError } = require('apollo-server-express');
const prisma = new PrismaClient();
const UserModel = require('../../../mongodb/user.model');
const fetch = require('cross-fetch');

// Data
const users = [
  { id: '1', email: 'sarah@xyz.com', gender: 'FEMALE' },
  { id: '2', email: 'mike@xyz.com', gender: 'MALE' },
];

let userIdCounter = 3;

// Resolvers
const resolvers = {
  Query: {
    user: (_, { id }) => {
      if (id === 'unauth') {
        throw new ApolloError('User not authenticated', 'UNAUTHENTICATED');
      }

      const user = users.find((u) => u.id === id);
      if (!user) {
        throw new ApolloError('User not found', 'NOT_FOUND', {
          status: 404,
          reason: 'Invalid user ID',
        });
      }
      return user;
    },
    users: async () => {
      console.log('🟡 users resolver called at', new Date().toISOString());
      // return prisma.user.findMany();
      // return await UserModel.find();
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const json = await response.json();
      return json.map((user) => ({
        id: user.id,
        email: user.email || 'unknown@example.com',
        gender: 'OTHER',
      }));
    },
    me: (_, __, context) => {
      isAuthenticated(context.user);
      return context.user;
    },
    paginatedUsers: async (_, { take = 5, after }) => {
      const users = await prisma.user.findMany({
        take,
        skip: after ? 1 : 0,
        ...(after && { cursor: { id: after } }),
        orderBy: { id: 'asc' },
      });
      const lastUser = users[users.length - 1];

      return {
        users,
        pageInfo: {
          endCursor: lastUser?.id || null,
          hasNextPage: users.length === take,
        },
      };
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

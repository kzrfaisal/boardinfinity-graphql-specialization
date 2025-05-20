// Data
const users = [
  { id: '1', email: 'sarah@xyz.com', gender: 'FEMALE' },
  { id: '2', email: 'mike@xyz.com', gender: 'MALE' },
];

const addresses = [
  {
    id: '1',
    street: '123 Park Lane',
    city: 'New York',
    zip: '10001',
    landmark: 'Near Central Park',
    __typename: 'HomeAddress',
  },
  {
    id: '2',
    street: '400 Tech Avenue',
    city: 'San Francisco',
    zip: '94107',
    companyName: 'TechCorp Inc.',
    __typename: 'OfficeAddress',
  },
];

let userIdCounter = 3;

// Resolvers
const resolvers = {
  Query: {
    user: (_, args) => {
      return users.find((u) => u.id === args.id);
    },
    users: () => users,
    addresses: () => addresses,
    searchAddresses: () => addresses,
  },
  Mutation: {
    createUser: (_, { input }) => {
      const { email, password, gender } = input;
      // In real apps, you'd hash passwords and save to DB
      const newUser = {
        id: userIdCounter++,
        email,
        gender,
      };
      users.push(newUser);
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
    deleteUser: (_, { id }) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        throw new Error('User not found.');
      }
      users.splice(index, 1);
      return true;
    },
  },
};

module.exports = resolvers;

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
    users: () => users,
  },
  Mutation: {
    createUser: (_, { input }) => {
      let { email, password, gender } = input;

      // ✅ Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      // ✅ Sanitization steps
      email = email.trim().toLowerCase(); // Normalize casing
      password = password.trim(); // Remove extra spaces
      gender = gender?.toUpperCase(); // Ensure enum consistency if coming from raw input

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

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

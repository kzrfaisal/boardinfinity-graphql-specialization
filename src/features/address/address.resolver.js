// Data
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

// Resolvers
const resolvers = {
  Query: {
    addresses: () => addresses,
    searchAddresses: () => addresses,
  },
  // User: {
  //   addresses: (user) => addresses,
  // },
};

module.exports = resolvers;

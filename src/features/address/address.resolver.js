// Data
const addresses = [
  { id: '1', street: '123 Park Lane', locationId: 'l1' },
  { id: '2', street: '400 Tech Avenue', locationId: 'l2' },
  { id: '3', street: '88 Elm Street', locationId: 'l1' },
  { id: '4', street: '12 Industrial Road', locationId: 'l2' },
  { id: '5', street: '908 Oak Avenue', locationId: 'l1' },
  { id: '6', street: '520 Market Street', locationId: 'l2' },
  { id: '7', street: '300 Maple Ave', locationId: 'l1' },
  { id: '8', street: '1400 Innovation Blvd', locationId: 'l2' },
  { id: '9', street: '77 Ocean Drive', locationId: 'l1' },
  { id: '10', street: '350 Silicon Avenue', locationId: 'l2' },
];

const locationData = {
  l1: { id: 'l1', city: 'New York', zip: '10001' },
  l2: { id: 'l2', city: 'San Francisco', zip: '94107' },
};

// Resolvers
const resolvers = {
  Query: {
    addresses: () => addresses,
    searchAddresses: () => addresses,
  },
  Address: {
    locationDetails: (address, _, context) => {
      return context.loaders.locationLoader.load(address.locationId);
    },
  },
  // User: {
  //   addresses: (user) => addresses,
  // },
};

module.exports = resolvers;

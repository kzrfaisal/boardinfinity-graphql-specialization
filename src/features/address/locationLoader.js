const DataLoader = require('dataloader');

const locationData = {
  l1: { id: 'l1', city: 'New York', zip: '10001' },
  l2: { id: 'l2', city: 'San Francisco', zip: '94107' },
};

function createLocationLoader() {
  return new DataLoader(async (keys) => {
    console.log('Batch loading for keys:', keys);
    return keys.map((key) => locationData[key]);
  });
}

module.exports = { createLocationLoader };

const UserModel = require('./user.model');

async function main() {
  UserModel.insertMany([
    { id: '11', email: 'alice@example.com', gender: 'FEMALE' },
    { id: '12', email: 'bob@example.com', gender: 'MALE' },
  ]);
}

main();

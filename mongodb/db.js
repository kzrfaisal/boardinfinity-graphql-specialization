// server.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/graphql-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;

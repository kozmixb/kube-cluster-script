require('dotenv').config();
const { showNamespace } = require('./components/namespace');
const { listServices } = require('./components/services');

console.clear();

showNamespace()
  .then(() => listServices())
  .catch((err) => console.log(err));

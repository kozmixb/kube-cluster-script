require('dotenv').config();
const { createNamespace } = require('./components/namespace');
const { initServices } = require('./components/services');
const { deploy } = require('./components/deployment');

console.clear();

createNamespace()
  .then(() => initServices)
  .then(() => deploy())
  .catch((err) => console.log(err));

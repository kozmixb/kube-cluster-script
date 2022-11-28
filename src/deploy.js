require('dotenv').config();
const { initServices } = require('./components/services');
const { deploy } = require('./components/deployment');

console.clear();

initServices()
  .then(() => deploy())
  .catch((err) => console.log(err));

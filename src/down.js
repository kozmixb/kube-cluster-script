require('dotenv').config();
const { deleteNamespace } = require('./Services/NamespaceHandler');

console.log('Shutting down kubernetes cluster');
console.log();
deleteNamespace();

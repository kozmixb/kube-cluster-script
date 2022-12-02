require('dotenv').config();
const { deleteNamespace } = require('./Services/NamespaceHandler');

console.log('\x1b[32mShutting down kubernetes cluster\x1b[0m');
console.log();
deleteNamespace();

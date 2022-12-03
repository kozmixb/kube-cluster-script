require('dotenv').config();
import { deleteNamespace } from './Services/NamespaceHandler';

console.log('Shutting down kubernetes cluster');
console.log();
deleteNamespace();

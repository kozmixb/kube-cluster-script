const config = require('../../templates/namespace.json');

const getNamespaceName = () => process.env.APP_NAMESPACE || config.metadata.name;

const getConfig = () => {
  if (process.env.APP_NAMESPACE) {
    config.metadata.name = process.env.APP_NAMESPACE;
  }

  return config;
};

exports.getNamespaceName = getNamespaceName;
exports.getConfig = getConfig;

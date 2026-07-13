const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

config.server.rewriteRequestUrl = (url) => {
  if (url.includes('platform=web')) {
    return url.replace('transform.engine=hermes', 'transform.engine=jsc');
  }
  return url;
};

module.exports = config;

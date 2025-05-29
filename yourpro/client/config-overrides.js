module.exports = function override(config, env) {
  // Disable the host check
  config.devServer = {
    ...config.devServer,
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 3000,
  };
  return config;
}; 
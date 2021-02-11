module.exports = {
  rollup(config, options) {
    config.output.name = 'numericQuantity';
    config.output.exports = 'default';
    return config;
  },
};

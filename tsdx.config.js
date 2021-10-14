const replace = require('@rollup/plugin-replace');

module.exports = {
  rollup(config, options) {
    config.output.name = 'numericQuantity';
    config.output.exports = 'default';
    config.plugins = config.plugins.map(p =>
      p.name === 'replace'
        ? replace({
            'process.env.NODE_ENV': JSON.stringify(options.env),
            preventAssignment: true,
          })
        : p
    );
    return config;
  },
};

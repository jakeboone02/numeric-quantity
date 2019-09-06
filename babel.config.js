module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: 'last 1 version, > 1%, maintained node versions, not dead' },
    ],
    '@babel/preset-typescript',
  ],
};

module.exports = function (api) {
  const isProduction = api.env('production');

  return {
    presets: [
      ['@babel/preset-env'],
      [
        '@babel/preset-react',
        {
          development: !isProduction,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-transform-react-jsx'],
      ['babel-plugin-styled-components'],
    ],
    sourceMaps: true,
  };
};

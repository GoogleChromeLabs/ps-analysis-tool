const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyPlugin = require("copy-webpack-plugin");
const WebpackBar = require('webpackbar');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.([jt])sx?$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        // svg
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  devtool: ! isProduction ? 'source-map' : undefined,
  mode,
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
  },
}

const root = {
  entry: {
    'service-worker': './src/service-worker.ts',
  },
  output: {
    path: path.resolve( __dirname, '../../dist/extension' ),
    filename: 'service-worker.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/manifest.json", to: "" },
        { from: "icons", to: "icons" },
      ],
    }),
    new WebpackBar({
      name: "Root",
      color: '#EEE070',
    })
  ],
  ...commonConfig
}

const devTools = {
  entry: {
    index: './src/devtools/index.tsx',
    devtools: './src/devtools/devtools.ts'
  },
  output: {
    path: path.resolve( __dirname, '../../dist/extension/devtools' ),
    filename: '[name].js',
  },
  plugins: [
    new WebpackBar({
      name: "DevTools",
      color: '#357BB5',
    }),
    new HtmlWebpackPlugin( {
      title: 'CAT Devtool',
      template: './src/devtools/index.html',
      filename: 'index.html',
      inject: false,
    } ),
    new HtmlWebpackPlugin( {
      title: 'CAT',
      template: './src/devtools/devtools.html',
      filename: 'devtools.html',
      inject: false
    } ),
  ],
  ...commonConfig,
}


module.exports = [
  root,
  devTools,
]

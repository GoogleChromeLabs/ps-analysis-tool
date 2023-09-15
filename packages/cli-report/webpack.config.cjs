/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');

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
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../../postcss.config.cjs'),
              },
            },
          },
        ],
      },
      {
        // svg
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  devtool: !isProduction ? 'source-map' : undefined,
  mode,
  resolve: {
    // Fixes resolving packages in the monorepo so we use the "src" folder, not "dist".
    exportsFields: ['customExports', 'exports'],
    extensions: ['.ts', '.tsx', '.js'],
  },
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
};

const dashboard = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new WebpackBar({
      name: 'Dashboard',
      color: '#357BB5',
    }),
    new HtmlWebpackPlugin({
      title: 'Report',
      template: './public/index.html',
      filename: 'index.html',
      inject: false,
    }),
    new CopyPlugin({
      patterns: [{ from: '../../out', to: 'out' }],
    }),
  ],
  ...commonConfig,
};

module.exports = dashboard;

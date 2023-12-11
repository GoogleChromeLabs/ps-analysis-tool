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
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const commonConfig = require('../../webpack.shared.cjs');

const analysisFrontend = {
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
    new Dotenv({
      path: '../../.env.frontend',
    }),
    new CopyPlugin({
      patterns: [{ from: './assets', to: 'assets' }],
    }),
    new WebpackBar({
      name: 'Analysis frontend',
      color: '#357BB5',
    }),
    new HtmlWebpackPlugin({
      title: 'Report',
      template: './public/index.html',
      filename: 'index.html',
      inject: false,
    }),
  ],
  ...commonConfig,
};

module.exports = analysisFrontend;

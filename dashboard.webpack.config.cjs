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
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const commonConfig = require('./webpack.shared.cjs');

const report = {
  entry: {
    index: './packages/report/src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './dist/cli-dashboard/report'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new WebpackBar({
      name: 'Report',
      color: '#357B66',
    }),
    new HtmlWebpackPlugin({
      title: 'Report',
      template: './packages/report/public/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new HtmlInlineScriptPlugin(),
  ],
  ...commonConfig,
};

const dashboard = {
  entry: {
    index: './packages/cli-dashboard/src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './dist/cli-dashboard'),
    filename: '[name].js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './dist/cli-dashboard'),
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
      template: './packages/cli-dashboard/public/index.html',
      filename: 'index.html',
      inject: false,
    }),
    new CopyPlugin({
      patterns: [{ from: './out', to: 'out' }],
    }),
  ],
  ...commonConfig,
};

module.exports = [dashboard, report];

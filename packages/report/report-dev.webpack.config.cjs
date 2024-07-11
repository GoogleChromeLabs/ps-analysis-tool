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
const WebpackBar = require('webpackbar');
const commonConfig = require('../../webpack.shared.cjs');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// Webpack configuration only for the development of report.
const report = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './packages/report/dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new WebpackBar({
      name: 'Report Dev',
      color: '#357B66',
    }),
    new HtmlWebpackPlugin({
      title: 'Report',
      template: './public/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new HtmlInlineScriptPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  ...commonConfig,
};

module.exports = [report];

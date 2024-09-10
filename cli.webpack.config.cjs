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
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const commonConfig = require('./webpack.shared.cjs');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');

module.exports = {
  entry: './src/index.ts',
  target: 'node', // Important for Node.js modules
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  output: {
    path: path.resolve(__dirname, './packages/cli/dist'),
    filename: '[name].js',
  },
  plugins: [
    new WebpackBar({
      name: 'CLI',
      color: '#FF9B71',
    }),
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new CopyPlugin({
      patterns: [
        { from: '../../assets', to: 'assets' },
        { from: '../../data', to: 'assets/data' },
      ],
    }),
  ],
  stats: 'errors-only',
  ...commonConfig,
};

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

const root = {
  entry: {
    'service-worker': './packages/extension/src/serviceWorker/index.ts',
    'content-script': './packages/extension/src/contentScript/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/extension'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.json', to: '' },
        { from: './icons', to: 'icons' },
        { from: '../../assets', to: 'assets' },
        { from: '../../data', to: 'data' },
        {
          from: './packages/i18n/_locales/messages',
          to: './_locales/',
        },
      ],
    }),
    new WebpackBar({
      name: 'Root',
      color: '#EEE070',
    }),
  ],
  ...commonConfig,
};

const devTools = {
  entry: {
    index: './packages/extension/src/view/devtools/index.tsx',
    devtools: './packages/extension/src/view/devtools/devtools.ts',
    worker: './packages/extension/src/worker/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/extension/devtools'),
    filename: '[name].js',
  },
  plugins: [
    new WebpackBar({
      name: 'DevTools',
      color: '#357BB5',
    }),
    new HtmlWebpackPlugin({
      title: 'PSAT Devtool',
      template: './packages/extension/src/view/devtools/index.html',
      filename: 'index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'PSAT',
      template: './packages/extension/src/view/devtools/devtools.html',
      filename: 'devtools.html',
      inject: true,
    }),
  ],
  ...commonConfig,
};

const popup = {
  entry: {
    index: './packages/extension/src/view/popup/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './dist/extension/popup'),
    filename: 'index.js',
  },
  plugins: [
    new WebpackBar({
      name: 'Popup',
      color: '#fcd8ba',
    }),
    new HtmlWebpackPlugin({
      title: 'PSAT Popup',
      template: './packages/extension/src/view/popup/index.html',
      inject: false,
    }),
  ],
  ...commonConfig,
};

const report = {
  entry: {
    index: '../report/src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './dist/extension/report'),
    filename: '[name].js',
  },
  plugins: [
    new WebpackBar({
      name: 'Report',
      color: '#357B66',
    }),
    new HtmlWebpackPlugin({
      title: 'Report',
      template: '../report/public/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new HtmlInlineScriptPlugin(),
  ],
  ...commonConfig,
};

module.exports = [root, devTools, popup, report];

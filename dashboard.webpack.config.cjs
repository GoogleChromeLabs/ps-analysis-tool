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
/**
 * External dependencies.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

/**
 * Internal dependencies.
 */
const commonConfig = require('./webpack.shared.cjs');

const dashboard = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, './packages/cli-dashboard/dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new WebpackBar({
      name: 'Dashboard',
      color: '#357BB5',
    }),
    new HtmlWebpackPlugin({
      title: 'Report',
      template:
        commonConfig.mode === 'production'
          ? '../cli-dashboard/public/index-production.html'
          : '../cli-dashboard/public/index.html',
      filename: 'index.html',
      inject: commonConfig.mode === 'production' ? 'body' : false,
    }),
    ...(commonConfig.mode === 'production'
      ? [new HtmlInlineScriptPlugin()]
      : []),
    ...(commonConfig.mode !== 'production'
      ? [new ReactRefreshWebpackPlugin()]
      : []),
    new CopyPlugin({
      patterns: [
        {
          from: '../i18n/_locales/messages',
          to: './_locales/',
        },
      ],
    }),
  ],
  ...commonConfig,
};

module.exports = [dashboard];

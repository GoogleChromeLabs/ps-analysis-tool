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
const CopyPlugin = require('copy-webpack-plugin');
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
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'tailwindcss',
                    {
                      config: './packages/extension/tailwind.config.cjs',
                    },
                  ],
                  ['autoprefixer'],
                ],
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
    extensions: ['.ts', '.tsx', '.js'],
  },
};

const root = {
  entry: {
    'service-worker': './packages/extension/src/worker/service-worker.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist/extension'),
    filename: 'service-worker.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './packages/extension/src/manifest.json', to: '' },
        { from: './packages/extension/icons', to: 'icons' },
        { from: './third_party', to: 'third_party' },
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
      title: 'CAT Devtool',
      template: './packages/extension/src/view/devtools/index.html',
      filename: 'index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'CAT',
      template: './packages/extension/src/view/devtools/devtools.html',
      filename: 'devtools.html',
      inject: false,
    }),
  ],
  ...commonConfig,
};

module.exports = [root, devTools];

/*
 * Copyright 2024 Google LLC
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

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './packages/explorable-explanations/dist'),
    publicPath: '/', // Base path for all assets
  },
  mode: 'development', // Set mode to development
  devtool: 'source-map', // Enable source maps for easier debugging
  devServer: {
    static: {
      directory: path.resolve(
        __dirname,
        './packages/explorable-explanations/public'
      ),
    },
    compress: true, // Enable gzip compression
    port: 8080, // The port on which the server will run
    open: true, // Open browser after server starts
    hot: true, // Enable hot module replacement (HMR)
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Optionally use Babel to transpile modern JS
        },
      },
    ],
  },
};

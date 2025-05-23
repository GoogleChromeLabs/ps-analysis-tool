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
module.exports = function (api) {
  const isProduction = api.env('production');

  return {
    presets: [
      ['@babel/preset-env'],
      [
        '@babel/preset-react',
        {
          development: !isProduction,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-transform-react-jsx'],
      ['babel-plugin-styled-components'],
    ],
    sourceMaps: true,
  };
};

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

const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

// @see https://github.com/tailwindlabs/tailwindcss/issues/4690#issuecomment-1046087220
delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

module.exports = {
  content: ['./packages/extension/src/**/*.{tsx,js}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl':
          '0px 38px 90px 0px rgba(0, 0, 0, 0.25), 0px 0px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.60)',
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
    },
    fontSize: {
      ...defaultTheme.fontSize,
      xxxs: '0.625rem', // 10px - Only for edge cases
    },
    textColor: {
      ...colors,
      primary: '#000',
      secondary: '#5F5F5F',
      tertiary: '#808080',
      'first-party': '#5FA569',
      'third-party': '#FA752E',
      'chart-label': '#111B21',
      'granite-gray': '#5F6369',
      'outer-space': '#303942',
      'raisin-black': '#212121',
      'royal-blue': '#3871E0',
      gray: '#6E6E6E',
    },
    backgroundColor: {
      ...colors,
      primary: '#FFF',
      secondary: '#E5E7EB',
      tertiary: '#CBD5E1',
      'royal-blue': '#3871E0',
      'anti-flash-white': '#F1F3F4',
      gainsboro: '#DADCE0',
      'american-silver': '#CBCDD1',
      'raisin-black': '#212121',
      cultured: '#F6F6F699',
    },
    borderColor: {
      ...colors,
      'american-silver': '#CBCDD1',
    },
  },
};

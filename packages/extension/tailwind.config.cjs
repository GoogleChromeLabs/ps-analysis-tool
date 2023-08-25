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
  darkMode: 'class',
  content: ['./packages/extension/src/**/*.{tsx,js}'],
  theme: {
    extend: {
      boxShadow: {
        '3xl':
          '0px 38px 90px 0px rgba(0, 0, 0, 0.25), 0px 0px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.60)',
      },
      keyframes: {
        'horizontal-spinner-keyframes': {
          '0%': { left: '0%', transform: 'translateX(-100%)' },
          '100%': { left: '100%', transform: 'translateX(0%)' },
        },
      },
      animation: {
        'horizontal-spinner': 'horizontal-spinner-keyframes 2s linear infinite',
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
    },
    fontSize: {
      ...defaultTheme.fontSize,
      xxxs: '0.625rem', // 10px - Only for edge cases
      xxl: '1.375rem', // 22px
    },
    fontWeight: {
      ...defaultTheme.fontWeight,
      'semi-thick': 510,
    },
    textColor: {
      ...colors,
      primary: '#000',
      secondary: '#5F5F5F',
      tertiary: '#808080',
      'first-party': '#5FA569',
      'third-party': '#FA752E',
      functional: '#5CC971',
      marketing: '#F3AE4E',
      analytics: '#4C79F4',
      uncategorized: '#EC7159',
      'chart-label': '#111B21',
      'granite-gray': '#5F6369',
      'outer-space-crayola': '#303942',
      'dark-gray': '#757575',
      'darkest-gray': '#616161',
      'outer-space': '#303942',
      'raisin-black': '#212121',
      gray: '#6E6E6E',
      'royal-blue': '#3871E0',
      manatee: '#9AA0A6',
      'bright-gray': '#E8EAED',
      'chinese-silver': '#CDCDCD',
      'medium-persian-blue': '#0E639C',
      mischka: '#AFB0B1',
      'cool-grey': '#323941',
      'asteriod-black': '#2B2C2F',
      'comet-black': '#202124',
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
      'light-gray': '#F1F1F1',
      'charleston-green': '#292A2D',
      quartz: '#494C50',
      'davys-grey': '#5D5D5D99',
      'outer-space-crayola': '#303942',
      'outer-space': '#454545',
      'medium-persian-blue': '#0E639C',
      'dark-blue': '#0535C1',
    },
    borderColor: {
      ...colors,
      'american-silver': '#CBCDD1',
      'royal-blue': '#3871E0',
      'medium-persian-blue': '#0E639C',
      'hex-gray': '#E0E0E0',
      'bright-gray': '#E8EAED',
      quartz: '#494C50',
      gainsboro: '#DADCE0',
    },
    colors: {
      ...colors,
      'royal-blue': '#3871E0',
      'hex-gray': '#E0E0E0',
      'bright-gray': '#E8EAED',
      quartz: '#494C50',
      manatee: '#9AA0A6',
      'medium-persian-blue': '#0E639C',
      'charleston-green': '#292A2D',
    },
    stroke: {
      'bright-gray': '#E8EAED',
      onyx: '#323941',
    },
  },
};

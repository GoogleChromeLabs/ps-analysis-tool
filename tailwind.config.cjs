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
  content: [
    path.resolve(__dirname, './packages/extension/src/**/*.{tsx,ts,js}'),
    path.resolve(__dirname, './packages/design-system/src/**/*.{tsx,ts,js}'),
    path.resolve(__dirname, './packages/cli-dashboard/src/**/*.{tsx,ts,js}'),
    path.resolve(
      __dirname,
      './packages/library-detection/src/**/*.{tsx,ts,js}'
    ),
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl':
          '0px 38px 90px 0px rgba(0, 0, 0, 0.25), 0px 0px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.60)',
        xxs: '0 -2px 2px 0 rgba(0, 0, 0, 0.1)',
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
      screens: {
        ...defaultTheme.screens,
        xxs: '360px',
        xs: '480px',
      },
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      xs: '3px',
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
    },
    fontSize: {
      ...defaultTheme.fontSize,
      xxxs: '0.625rem', // 10px - Only for edge cases
      xxl: '1.375rem', // 22px
      xsm: '0.9375rem',
      xxs: '0.8125rem',
    },
    fontWeight: {
      ...defaultTheme.fontWeight,
      'semi-thick': 510,
    },
    textColor: {
      ...colors,
      'text-medium-gray': '#BDBDBD',
      'chestnut-gold': '#A98307',
      'battle-dress': '#7D8471',
      brownstone: '#79553D',
      'upsed-tomato': '#AF2B1E',
      'honey-wax': '#FFA420',
      'sparks-in-the-dark': '#FF7514',
      'verve-violet': '#924E7D',
      'red-radish': '#E63244',
      'ancient-maze': '#999950',
      'fandango-pink': '#DE4C8A',
      'grilled-cheese': '#FFC75F',
      'burnished-russet': '#763C28',
      'spring-roll': '#C6A664',
      'really-rain': '#E7EBDA',
      'pixelated-grass': '#008F39',
      'pixelated-dark-green': '#1C542D',
      'jay-bird': '#4E8397',
      'john-lemon': '#EDFF21',
      'rainy-grey': '#A5A5A5',
      'discovery-bay': '#256D7B',
      crust: '#898176',
      'azurite-water-green': '#497E76',
      'kingfisher-turquoise': '#7FB5B5',
      'egyptian-gold': '#EFA94A',
      magentarama: '#CF3476',
      'victorian-violet': '#AF7AA3',
      'good-life': '#C5A06A',
      'greenland-green': '#25ACAD',
      'strawberry-spinach-red': '#F54021',
      'hotrod-brown': '#D5CABD',
      primary: '#000',
      secondary: '#5F5F5F',
      tertiary: '#808080',
      'first-party': '#5FA569',
      'third-party': '#FA752E',
      functional: '#5CC971',
      marketing: '#F3AE4E',
      analytics: '#4C79F4',
      uncategorized: '#EC7159',
      'dirty-red': '#EE442F',
      'chart-label': '#111B21',
      'granite-gray': '#5F6369',
      'outer-space-crayola': '#303942',
      'dark-gray': '#757575',
      'darkest-gray': '#616161',
      'outer-space': '#303942',
      'raisin-black': '#212121',
      gray: '#6E6E6E',
      'royal-blue': '#3871E0',
      'bright-navy-blue': '#1A73E8',
      'bright-navy-blue-25': '#1A73E840',
      'jordy-blue': '#8AB7F8',
      manatee: '#9AA0A6',
      'bright-gray': '#E8EAED',
      'chinese-silver': '#CDCDCD',
      'medium-persian-blue': '#0E639C',
      mischka: '#AFB0B1',
      'cool-grey': '#323941',
      'asteriod-black': '#2B2C2F',
      'comet-black': '#202124',
      'comet-grey': '#474747',
      'jet-black': '#202142',
      'warning-red': '#C33300',
      'warning-orange': '#FE8d59',
    },
    backgroundColor: {
      ...colors,
      primary: '#FFF',
      'google-blue': '#8AB4F8',
      'smurf-blue': '#1967D2',
      beteleguese: '#4285F4',
      'toggle-on': '#5CC971',
      'flagged-row-odd-dark': '#5e5108',
      'flagged-row-even-dark': '#796700',
      'flagged-row-odd-light': '#f7eaa1',
      'flagged-row-even-light': '#fff09b',
      secondary: '#E5E7EB',
      tertiary: '#CBD5E1',
      'royal-blue': '#3871E0',
      'bright-navy-blue': '#1A73E8',
      'absolute-zero-crayola': '#0535C1',
      'ocean-boat-blue': '#1177BB',
      'anti-flash-white': '#F1F3F4',
      gainsboro: '#DADCE0',
      'american-silver': '#CBCDD1',
      'raisin-black': '#212121',
      sapphire: '#0B57D0',
      'baby-blue-eyes': '#A8C7FA',
      'tufts-blue': '#4D86E1',
      'pale-cornflower-blue': '#AECBFA',
      cultured: '#F6F6F699',
      'burnt-sienna-30': '#EC71594D',
      'light-gray': '#F1F1F1',
      'charleston-green': '#282828',
      quartz: '#494C50',
      'davys-grey': '#5D5D5D99',
      'outer-space-crayola': '#303942',
      'outer-space': '#454545',
      'medium-persian-blue': '#0E639C',
      'hsl-dark': '	hsl(var(--color-message-box-dark))',
      'hsl-light': 'hsla(var(--color-message-box-light) / 10%)',
      'dark-blue': '#0B57D0',
      'light-blue': '#ABC7FA',
      lotion: '#FDFCFB1A',
      'dynamic-grey': '#fbfbfb',
      'dirty-red': '#990000',
      'dirty-pink': '#FFD6D6',
      'jungle-green-light': '#234F1E',
      'jungle-green-dark': '#1C4218',
      'leaf-green-light': '#99EDC3',
      'leaf-green-dark': '#87DFB2',
      'eerie-black': '#1F1F1F0F',
      'light-yellow': '#FEFCE0',
    },
    borderColor: {
      ...colors,
      'american-silver': '#CBCDD1',
      'royal-blue': '#3871E0',
      'medium-persian-blue': '#0E639C',
      'bright-navy-blue': '#1A73E8',
      'hex-gray': '#E0E0E0',
      'bright-gray': '#E8EAED',
      'davys-grey': '#5D5D5D99',
      quartz: '#494C50',
      gainsboro: '#DADCE0',
      'chinese-silver': '#CDCDCD',
      'baby-blue-eyes': '#A8C7FA',
      'leaf-green-dark': '#87DFB2',
      sapphire: '#0B57D0',
    },
    colors: {
      ...colors,
      'royal-blue': '#3871E0',
      'hex-gray': '#E0E0E0',
      'bright-gray': '#E8EAED',
      quartz: '#494C50',
      manatee: '#9AA0A6',
      'medium-persian-blue': '#0E639C',
      'chinese-silver': '#CDCDCD',
      'charleston-green': '#292A2D',
      'outer-space': '#303942',
      'granite-gray': '#5F6369',
      gray: '#6E6E6E',
    },
    stroke: {
      'bright-gray': '#E8EAED',
      onyx: '#323941',
    },
  },
};

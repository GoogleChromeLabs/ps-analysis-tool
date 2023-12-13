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
    path.resolve(__dirname, './packages/extension/src/**/*.{tsx,js}'),
    path.resolve(__dirname, './packages/design-system/src/**/*.{tsx,js}'),
    path.resolve(__dirname, './packages/cli-dashboard/src/**/*.{tsx,js}'),
  ],
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
      secureonly: '#A98307',
      domainmismatch: '#7D8471',
      notonpath: '#79553D',
      samesitestrict: '#AF2B1E',
      samesitesax: '#FFA420',
      samesiteunspecifiedtreatedaslax: '#FF7514',
      samesitenoneinsecure: '#924E7D',
      userpreferences: '#E63244',
      thirdpartyphaseout: '#999950',
      thirdpartyblockedinfirstpartyset: '#DE4C8A',
      unknownerror: '#DE4C8A',
      schemefulsamesitestrict: '#763C28',
      schemefulsamesitelax: '#C6A664',
      schemefulsamesiteunspecifiedtreatedaslax: '#E7EBDA',
      samepartyfromcrosspartycontext: '#008F39',
      namevaluepairexceedsmaxsize: '#1C542D',
      excludesamesiteunspecifiedtreatedaslax: '#1C542D',
      excludesamesitenoneinsecure: '#EDFF21',
      excludesamesitelax: '#A5A5A5',
      excludesamesitestrict: '#256D7B',
      excludeinvalidsameparty: '#898176',
      excludesamepartycrosspartycontext: '#497E76',
      excludedomainnonascii: '#7FB5B5',
      excludethirdpartycookieblockedinfirstpartyset: '#EFA94A',
      excludethirdpartyphaseout: '#CF3476',
      'blocked-frames': '#AF7AA3',
      'cookie-frames': '#C5A06A',
      'total-frames': '#25ACAD',
      'unblocked-frames': '#D9F1BE',
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
      amoghagreen: '#abcded',
    },
    backgroundColor: {
      ...colors,
      primary: '#FFF',
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
      'charleston-green': '#292A2D',
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
      'dirty-red': '#990000',
      'dirty-pink': '#FFD6D6',
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
    },
    stroke: {
      'bright-gray': '#E8EAED',
      onyx: '#323941',
    },
  },
};

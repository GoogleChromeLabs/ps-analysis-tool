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
const config = {
  canvas: {
    width: 700,
    height: 500,
    extraHeight: 1600, // @todo: It needs to be calculated based on the content.
    extraWidth: 450, // @todo: It needs to be calculated based on the content.
    background: '#fff',
    fontSize: 12,
  },
  timeline: {
    position: { x: 100, y: 50 },
    circleProps: {
      diameter: 50,
      verticalSpacing: 130,
    },
    stepDelay: 1500,
    user: {
      width: 30,
      height: 30,
    },
    expandIconSize: 20,
    infoIconSize: 16,
    circles: [
      {
        type: 'advertiser',
        website: 'apple.com',
        datetime: '2023-10-01 10:00',
        igGroupsCount: 3,
        interestGroups: ['laptops', 'headphones', 'phones'],
        logoSize: { width: 25, height: 25 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'myntra.com',
        datetime: '2023-10-01 11:00',
        igGroupsCount: 2,
        interestGroups: ['stilletos', 'shorts'],
        logoSize: { width: 25, height: 20 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'publisher',
        website: 'newyorktimes.com',
        datetime: '2023-10-01 12:00',
        logoSize: { width: 25, height: 25 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'amazon.com',
        datetime: '2023-10-01 13:00',
        igGroupsCount: 2,
        interestGroups: ['bedsheets', 'pillows'],
        logoSize: { width: 25, height: 25 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'adidas.com',
        datetime: '2023-10-01 13:02',
        igGroupsCount: 3,
        interestGroups: ['football', 'basketball', 'baseball'],
        logoSize: { width: 30, height: 25 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'publisher',
        website: 'cnn.com',
        datetime: '2023-10-01 14:00',
        logoSize: { width: 30, height: 25 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'netflix.com',
        datetime: '2023-10-01 14:01',
        igGroupsCount: 3,
        interestGroups: ['movies', 'series', 'games'],
        logoSize: { width: 25, height: 25 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'kawasaki.com',
        datetime: '2023-10-01 15:00',
        igGroupsCount: 3,
        interestGroups: ['bikes', 'superbikes', 'bicycles'],
        logoSize: { width: 25, height: 30 },
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'publisher',
        website: 'aljazeera.com',
        datetime: '2023-10-01 16:00',
        logoSize: { width: 25, height: 25 },
        visited: false,
        visitedIndex: null,
      },
    ],
    colors: {
      visitedBlue: '#1A73E8',
      grey: '#808080',
      black: '#000000',
    },
  },
  flow: {
    box: { width: 125, height: 50 },
    smallBox: { width: 80, height: 50 },
    mediumBox: { width: 125, height: 50 },
    lineWidth: 100,
    lineHeight: 50,
    arrowSize: 10,
    colors: {
      box: {
        background: '255',
        notBrowser: '#ffec99',
        noData: '#e9ecef',
        text: '#000',
        borderStroke: [0, 0, 0],
      },
    },
  },
  rippleEffect: {
    ripples: [],
    numRipples: 3,
    maxRadius: 200,
    time: 4000,
    speed: 1,
    rippled: false,
  },
};

export default config;

export const publisherData = {
  'newyorktimes.com': {
    branches: [
      { date: 'Sun, 01 October 2023', time: '12:00:00 GMT', type: 'datetime' },
      { date: 'Sun, 01 October 2023', time: '12:01:00 GMT', type: 'datetime' },
      { date: 'Sun, 01 October 2023', time: '12:02:00 GMT', type: 'datetime' },
    ],
    adunits: ['div-200-1', 'div-200-2', 'div-200-3'],
    ssps: [
      ['SSP A', 'https://ssp-a.com'],
      ['SSP B', 'https://ssp-b.com'],
      ['SSP C', 'https://ssp-c.com'],
    ],
  },
  'cnn.com': {
    branches: [
      { date: 'Sun, 01 October 2023', time: '14:00:00 GMT', type: 'datetime' },
      { date: 'Sun, 01 October 2023', time: '14:01:00 GMT', type: 'datetime' },
      { date: 'Sun, 01 October 2023', time: '14:02:00 GMT', type: 'datetime' },
    ],
    adunits: ['div-400-1', 'div-400-2', 'div-400-3'],
    ssps: [
      ['SSP D', 'https://ssp-d.com'],
      ['SSP E', 'https://ssp-e.com'],
      ['SSP F', 'https://ssp-f.com'],
    ],
  },
  'aljazeera.com': {
    branches: [
      { date: 'Sun, 01 October 2023', time: '16:00:00 GMT', type: 'datetime' },
      { date: 'Sun, 01 October 2023', time: '16:01:00 GMT', type: 'datetime' },
      { date: 'Sun, 01 October 2023', time: '16:02:00 GMT', type: 'datetime' },
    ],
    adunits: ['div-600-1', 'div-600-2', 'div-600-3'],
    ssps: [
      ['SSP G', 'https://ssp-g.com'],
      ['SSP H', 'https://ssp-h.com'],
      ['SSP I', 'https://ssp-i.com'],
    ],
  },
};

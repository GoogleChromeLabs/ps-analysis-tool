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
 * Internal dependencies.
 */
import type { Circle } from './types';

type Ripple = {
  radius: number;
  baseSpeed: number;
};

export type Config = {
  canvas: {
    width: number;
    height: number;
    extraHeight: number;
    extraWidth: number;
    background: string;
    fontSize: number;
  };
  timeline: {
    position: { x: number; y: number };
    circleProps: {
      diameter: number;
      verticalSpacing: number;
    };
    stepDelay: number;
    user: {
      width: number;
      height: number;
    };
    expandIconSize: number;
    infoIconSize: number;
    circles: Circle[];
    colors: {
      visitedBlue: string;
      grey: string;
      black: string;
    };
  };
  flow: {
    box: { width: number; height: number };
    smallBox: { width: number; height: number };
    mediumBox: { width: number; height: number };
    lineWidth: number;
    lineHeight: number;
    arrowSize: number;
    colors: {
      box: {
        background: string;
        notBrowser: string;
        text: string;
        borderStroke: number[];
        noData: string;
        browser: string;
      };
    };
  };
  rippleEffect: {
    ripples: Ripple[];
    numRipples: number;
    maxRadius: number;
    time: number;
    speed: number;
    rippled: boolean;
  };
};

const config: Config = {
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
      verticalSpacing: 70,
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
        website: 'adv1.com',
        datetime: '2023-10-01 10:00',
        igGroupsCount: 3,
        interestGroups: ['shoes', 'heels', 'phones'],
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'adv2.com',
        datetime: '2023-10-01 11:00',
        igGroupsCount: 2,
        interestGroups: ['stilletos', 'shorts'],
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'publisher',
        website: 'pub1.com',
        datetime: '2023-10-01 12:00',
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'adv3.com',
        datetime: '2023-10-01 13:00',
        igGroupsCount: 2,
        interestGroups: ['bike', 'car'],
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'adv5.com',
        datetime: '2023-10-01 13:02',
        igGroupsCount: 3,
        interestGroups: ['football', 'basketball', 'baseball'],
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'publisher',
        website: 'pub2.com',
        datetime: '2023-10-01 14:00',
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'adv6.com',
        datetime: '2023-10-01 14:01',
        igGroupsCount: 3,
        interestGroups: ['movies', 'series', 'books'],
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'advertiser',
        website: 'adv7.com',
        datetime: '2023-10-01 15:00',
        igGroupsCount: 3,
        interestGroups: ['IGG220', 'IGG201', 'IG225'],
        visited: false,
        visitedIndex: null,
      },
      {
        type: 'publisher',
        website: 'pub3.com',
        datetime: '2023-10-01 16:00',
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
        browser: '#FFF',
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
  'pub1.com': {
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
  'pub2.com': {
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
  'pub3.com': {
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

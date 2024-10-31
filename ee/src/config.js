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
    background: 245,
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
    circles: [
      { type: 'advertiser', website: 'adv1.com', datetime: '2023-10-01 10:00' },
      { type: 'advertiser', website: 'adv2.com', datetime: '2023-10-01 11:00' },
      { type: 'publisher', website: 'pub1.com', datetime: '2023-10-01 12:00' },
      { type: 'advertiser', website: 'adv3.com', datetime: '2023-10-01 13:00' },
      { type: 'advertiser', website: 'adv5.com', datetime: '2023-10-01 13:02' },
      { type: 'publisher', website: 'pub2.com', datetime: '2023-10-01 14:00' },
      { type: 'advertiser', website: 'adv6.com', datetime: '2023-10-01 14:01' },
      { type: 'advertiser', website: 'adv7.com', datetime: '2023-10-01 15:00' },
    ],
    colors: {
      visitedBlue: '#1A73E8',
      grey: '#808080',
    },
  },
  flow: {
    box: { width: 125, height: 100 },
    smallBox: { width: 80, height: 50 },
    mediumBox: { width: 125, height: 50 },
    lineWidth: 100,
    lineHeight: 50,
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
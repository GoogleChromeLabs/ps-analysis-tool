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
import app from '../../app';
import { Branches } from '../../components';
import config from '../../config';

export const branchesData = {
  'pub1.com': [
    { date: 'Sun, 01 October 2023', time: '12:00:00 GMT', type: 'datetime' },
    { date: 'Sun, 01 October 2023', time: '12:01:00 GMT', type: 'datetime' },
    { date: 'Sun, 01 October 2023', time: '12:02:00 GMT', type: 'datetime' },
  ],
  'pub2.com': [
    { date: 'Sun, 01 October 2023', time: '14:00:00 GMT', type: 'datetime' },
    { date: 'Sun, 01 October 2023', time: '14:01:00 GMT', type: 'datetime' },
    { date: 'Sun, 01 October 2023', time: '14:02:00 GMT', type: 'datetime' },
  ],
  'pub3.com': [
    { date: 'Sun, 01 October 2023', time: '16:00:00 GMT', type: 'datetime' },
    { date: 'Sun, 01 October 2023', time: '16:01:00 GMT', type: 'datetime' },
    { date: 'Sun, 01 October 2023', time: '16:02:00 GMT', type: 'datetime' },
  ],
};

const setupBranches = (steps, index) => {
  const publisher = config.timeline.circles[index].website;

  steps.push({
    component: Branches,
    props: {
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
      currentIndex: index,
      branches: [
        {
          date: branchesData[publisher][0].date,
          time: branchesData[publisher][0].time,
          type: 'datetime',
        },
        {
          date: branchesData[publisher][1].date,
          time: branchesData[publisher][1].time,
          type: 'datetime',
        },
        {
          date: branchesData[publisher][2].date,
          time: branchesData[publisher][2].time,
          type: 'datetime',
        },
      ],
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

export default setupBranches;

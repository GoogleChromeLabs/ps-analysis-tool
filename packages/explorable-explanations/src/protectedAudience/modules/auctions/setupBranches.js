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

const setupBranches = (steps, index) => {
  steps.push({
    component: Branches,
    props: {
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
      currentIndex: index,
      branches: [
        {
          date: 'Sun, 01 October 2023',
          time: '6:30:00 GMT',
          type: 'datetime',
        },
        {
          date: 'Sun, 01 October 2023',
          time: '6:31:00 GMT',
          type: 'datetime',
        },
        {
          date: 'Sun, 01 October 2023',
          time: '6:32:00 GMT',
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

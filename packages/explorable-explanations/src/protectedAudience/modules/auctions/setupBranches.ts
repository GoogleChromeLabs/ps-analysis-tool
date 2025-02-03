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
import config, { publisherData } from '../../config';
import { AuctionStep } from '../../../types';

const setupBranches = (steps: AuctionStep[], index: number) => {
  const publisher = config.timeline.circles[index].website;

  steps.push({
    component: Branches,
    props: {
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
      currentIndex: index,
      branches: [
        {
          date: publisherData[publisher].branches[0].date,
          time: publisherData[publisher].branches[0].time,
          type: 'datetime',
        },
        {
          date: publisherData[publisher].branches[1].date,
          time: publisherData[publisher].branches[1].time,
          type: 'datetime',
        },
        {
          date: publisherData[publisher].branches[2].date,
          time: publisherData[publisher].branches[2].time,
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

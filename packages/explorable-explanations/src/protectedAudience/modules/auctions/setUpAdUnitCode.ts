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
import config, { publisherData } from '../../config';
import flow from '../flow';
import { Branches } from '../../components';
import type { AuctionStep } from '../../types';

const setUpAdUnitCode = (steps: AuctionStep[], index: number) => {
  const { colors } = config.flow;
  const { x, y } = flow.getTimelineCircleCoordinates(index);
  const publisher = config.timeline.circles[index].website;

  // Setup Ad unit codes
  steps.push({
    component: Branches,
    props: {
      x1: x,
      y1: y,
      currentIndex: index,
      branches: [
        {
          title: 'adunit-code',
          description: publisherData[publisher].adunits[0],
          type: 'box',
          color: colors.box.browser,
        },
        {
          title: 'adunit-code',
          description: publisherData[publisher].adunits[1],
          type: 'box',
          color: colors.box.browser,
        },
        {
          title: 'adunit-code',
          description: publisherData[publisher].adunits[2],
          type: 'box',
          color: colors.box.browser,
        },
      ],
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

export default setUpAdUnitCode;

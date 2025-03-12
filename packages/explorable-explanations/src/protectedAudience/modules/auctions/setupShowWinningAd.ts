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
import config from '../../config';
import { ProgressLine, Box } from '../../components';
import type { AuctionStep } from '../../types';
import { getCoordinateValues } from '../../utils';
import scrollToNextCircle from '../../utils/scrollToNextCircle';

const setupShowWinningAd = (steps: AuctionStep[]) => {
  const { box } = config.flow;

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x + box.width / 2,
      y1: () => {
        return getCoordinateValues(app.auction.nextTipCoordinates).y + 10;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  const WINNING_AD_DELAY = 6000;

  steps.push({
    component: Box,
    props: {
      title: 'Show Winning Ad',
      x: () => getCoordinateValues(app.auction.nextTipCoordinates).x + 10,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y - box.height / 2,
    },
    delay: WINNING_AD_DELAY,
    callBack: (returnValue) => {
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
        const delay = WINNING_AD_DELAY / app.speedMultiplier;
        // wait longer for higher speeds
        const delayPercentage = app.speedMultiplier > 2 ? 0.5 : 0.8;
        scrollToNextCircle(delay * delayPercentage);
      }
    },
  });
};

export default setupShowWinningAd;

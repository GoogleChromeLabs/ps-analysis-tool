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
import app from '../../../app';
import config from '../../../config';
import { Box, ProgressLine } from '../../../components';
import { SINGLE_SELLER_CONFIG } from '../../flowConfig.tsx';
import type { AuctionStep } from '../../../types.ts';
import { getCoordinateValues } from '../../../utils/getCoordinateValues.ts';

const setUpSingleSellerFirstSSPTagFlow = (steps: AuctionStep[]) => {
  const { box, colors } = config.flow;

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 40,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: SINGLE_SELLER_CONFIG.SSP_TAG.title,
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
      y: () => getCoordinateValues(app.auction.nextTipCoordinates).y,
      info: SINGLE_SELLER_CONFIG.SSP_TAG.info,
      color: colors.box.yellowBox,
    },
    delay: 1000,
    callBack: (returnValue) => {
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
      }
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 40,
      text: 'Ad request',
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: SINGLE_SELLER_CONFIG.SSP.title,
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y +
        config.flow.arrowSize,
      info: SINGLE_SELLER_CONFIG.SSP.info,
      color: colors.box.yellowBox,
    },
    delay: 1000,
    callBack: (returnValue) => {
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
      }
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 40,
      text: 'OpenRTB \n bid request',
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: SINGLE_SELLER_CONFIG.DSPS.title,
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y +
        config.flow.arrowSize,
      info: SINGLE_SELLER_CONFIG.DSPS.info,
    },
    delay: 1000,
    callBack: (returnValue) => {
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
      }
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x + 10,
      y1: () => {
        return getCoordinateValues(app.auction.nextTipCoordinates).y - 15;
      },
      text: 'OpenRTB \n bid response',
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () => {
        return (
          getCoordinateValues(app.auction.nextTipCoordinates).y -
          box.height -
          10
        );
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x -
        10 +
        box.width / 2,
      y1: () => {
        return (
          getCoordinateValues(app.auction.nextTipCoordinates).y -
          10 -
          box.height / 2
        );
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

export default setUpSingleSellerFirstSSPTagFlow;

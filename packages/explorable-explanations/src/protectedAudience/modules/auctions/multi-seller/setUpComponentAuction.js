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
import setUpRunadAuction from '../setUpRunadAuction';

const setUpComponentAuction = (auction) => {
  const { box } = config.flow;

  const BORDER_WIDTH = 400;
  const BORDER_HEIGHT = BORDER_WIDTH;
  const BORDER_BOX_MARGIN = 50;
  const BOX_WIDTH = 800;
  const BOX_HEIGHT = 800;

  auction.steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + box.height - 10,
      customHeight: 150,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.coordinates.temp = returnValue;
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  auction.steps.push({
    component: Box,
    props: {
      title: '',
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
      x: () => app.auction.nextTipCoordinates?.x - BOX_WIDTH / 2,
      y: () => app.auction.nextTipCoordinates?.y,
    },
    delay: 1111111,
    callBack: (returnValue) => {
      const val = returnValue.down;

      app.auction.nextTipCoordinates = val;
    },
  });

  auction.steps.push({
    component: Box,
    props: {
      title: 'SSP A',
      x: () => app.auction.nextTipCoordinates?.x + BORDER_BOX_MARGIN,
      y: () =>
        app.auction.nextTipCoordinates?.y - BORDER_HEIGHT + BORDER_BOX_MARGIN,
    },
    delay: 1000,
    callBack: (returnValue) => {
      const val = returnValue.down;

      val.x = val.x - box.width / 2 - 10;
      val.y = val.y + box.height * 2;

      app.auction.nextTipCoordinates = val;
    },
  });

  auction.steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y,
      customHeight: BORDER_HEIGHT,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  setUpRunadAuction(auction);

  auction.steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y,
      customHeight: BORDER_HEIGHT,
      noArrow: true,
    },
    delay: 11111111111,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

export default setUpComponentAuction;

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
  const BORDER_BOX_MARGIN = 50;
  const BOX_WIDTH = 800;
  const BOX_HEIGHT = 800;
  const FIRST_LINE_HEIGHT = 150;

  auction.steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + box.height - 10,
      customHeight: FIRST_LINE_HEIGHT,
      noArrow: true,
    },
    callBack: (returnValue) => {
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
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  auction.steps.push({
    component: Box,
    props: {
      title: 'SSP A',
      x: () =>
        app.auction.nextTipCoordinates?.x - BOX_WIDTH / 2 + BORDER_BOX_MARGIN,
      y: () => app.auction.nextTipCoordinates?.y - FIRST_LINE_HEIGHT,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  setUpRunadAuction(auction);

  auction.steps.push({
    component: Box,
    props: {
      title: '',
      width: 1,
      height: 1,
      x: () => app.auction.nextTipCoordinates?.x,
      y: () => app.auction.nextTipCoordinates?.y,
    },
    delay: 11111111,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

export default setUpComponentAuction;

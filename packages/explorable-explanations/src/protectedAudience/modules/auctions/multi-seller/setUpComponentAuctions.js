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
import config, { publisherData } from '../../../config';
import { Box, ProgressLine, Text, Custom } from '../../../components';
import setUpRunadAuction from '../setUpRunadAuction';

const BOX_WIDTH = 1200;
const BOX_HEIGHT = 1100;
const FIRST_LINE_HEIGHT = 150;
const BORDER_BOX_MARGIN = 50;
const BOX_COLUMN_MARGIN = 390;

const boxCordinates = {};

const setUpComponentAuctions = (steps, index) => {
  const { box } = config.flow;
  const publisher = config.timeline.circles[index].website;

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + box.height - 12,
      customHeight: FIRST_LINE_HEIGHT,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: '',
      width: BOX_WIDTH,
      height: BOX_HEIGHT,
      x: () => {
        boxCordinates.x = app.auction.nextTipCoordinates?.x - BOX_WIDTH / 2;
        return boxCordinates.x;
      },
      y: () => {
        boxCordinates.y = app.auction.nextTipCoordinates?.y;
        return boxCordinates.y;
      },
      borderStroke: [0, 0, 0, 0],
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  const componentAuctions = [
    {
      title: 'Component Auction',
      x: () =>
        app.auction.nextTipCoordinates?.x -
        BOX_WIDTH / 2 +
        BORDER_BOX_MARGIN * 2 +
        20,
      y: () => app.auction.nextTipCoordinates?.y - 225 - 15,
      ssp: publisherData[publisher].ssps[0][0],
      config: {
        bidValue: '$10',
      },
    },
    {
      title: 'Component Auction',
      x: () => app.auction.nextTipCoordinates?.x + BOX_COLUMN_MARGIN,
      y: () =>
        app.auction.nextTipCoordinates?.y -
        BOX_HEIGHT +
        BORDER_BOX_MARGIN * 2 +
        15,
      ssp: publisherData[publisher].ssps[1][0],
      config: {
        bidValue: '$8',
      },
    },
    {
      title: 'Component Auction',
      x: () => app.auction.nextTipCoordinates?.x + BOX_COLUMN_MARGIN,
      y: () =>
        app.auction.nextTipCoordinates?.y -
        BOX_HEIGHT +
        BORDER_BOX_MARGIN * 2 +
        15,
      ssp: publisherData[publisher].ssps[2][0],
      config: {
        bidValue: '$6',
      },
    },
  ];

  componentAuctions.forEach((componentAuction, idx) => {
    setUpComponentAuction(
      steps,
      componentAuction,
      componentAuction.config,
      idx
    );
  });

  setUpTPoint(steps);

  setupAfterComponentAuctionFlow(steps);

  // steps.push({
  //   component: Text,
  //   props: {
  //     text: '.',
  //     x: () => app.auction.nextTipCoordinates?.x,
  //     y: () => app.auction.nextTipCoordinates?.y + 15,
  //   },
  //   delay: 11111111,
  //   callBack: (returnValue) => {
  //     app.auction.nextTipCoordinates = returnValue;
  //   },
  // });
};

const setUpComponentAuction = (
  steps,
  { title, x, y, ssp },
  { bidValue },
  index
) => {
  const { box, arrowSize } = config.flow;

  steps.push({
    component: Text,
    props: {
      text: title,
      x: x,
      y: y,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: ssp,
      x: () => app.auction.nextTipCoordinates?.x - BORDER_BOX_MARGIN - 15,
      y: () => app.auction.nextTipCoordinates?.y + 20,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = {
        x: returnValue.down.x,
        y: returnValue.down.y + box.height - arrowSize,
      };
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = {
        x: returnValue.x - box.width / 2 - 10,
        y: returnValue.y + box.height / 2 + arrowSize,
      };
    },
  });

  setUpRunadAuction(steps, () => {
    return {
      component: Custom,
      props: {
        render: () => {
          const p = app.p;

          if (index === 2) {
            p.push();
            p.noFill();
            p.rect(boxCordinates.x, boxCordinates.y, BOX_WIDTH, BOX_HEIGHT);
            p.strokeWeight(0.1);
            p.pop();
          }

          return {
            down: app.auction.nextTipCoordinates,
          };
        },
      },
      delay: 1000,
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue.down;
      },
    };
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + box.height - arrowSize,
      customHeight: 80,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Text,
    props: {
      text: bidValue,
      x: () => app.auction.nextTipCoordinates?.x,
      y: () => app.auction.nextTipCoordinates?.y + 15,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

const setUpTPoint = (steps) => {
  steps.push({
    component: ProgressLine,
    props: {
      direction: 'left',
      x1: () => app.auction.nextTipCoordinates?.x - 25,
      y1: () => app.auction.nextTipCoordinates?.y,
      customWidth: BOX_COLUMN_MARGIN - 55,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'left',
      x1: () => app.auction.nextTipCoordinates?.x - 55,
      y1: () => app.auction.nextTipCoordinates?.y,
      customWidth: BOX_COLUMN_MARGIN - 55,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x + BOX_COLUMN_MARGIN - 28,
      y1: () => app.auction.nextTipCoordinates?.y + 20,
      customHeight: 100,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

const setupAfterComponentAuctionFlow = (steps) => {
  const { box, arrowSize } = config.flow;

  steps.push({
    component: Box,
    props: {
      title: 'scoreAd()',
      description: '(by SSPs)',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + arrowSize,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + box.height - arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'reportWin()',
      description: '(on dsp.js)',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + arrowSize,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + box.height - arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'reportResult()',
      description: '(on ssp.js)',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + arrowSize,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () => app.auction.nextTipCoordinates?.x + box.width / 2 + 1,
      y1: () => app.auction.nextTipCoordinates?.y + arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'Show Winning Ad',
      x: () => app.auction.nextTipCoordinates?.x + arrowSize,
      y: () => app.auction.nextTipCoordinates?.y - box.height / 2 + 1,
    },
    delay: 1000,
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });
};

export default setUpComponentAuctions;

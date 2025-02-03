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
import { Box, ProgressLine, Text } from '../../../components';
import setUpRunadAuction from '../setUpRunadAuction';
import { MULTI_SELLER_CONFIG } from '../../flowConfig.jsx';
import { AuctionStep, Coordinates } from '../../../../types';

const BOX_WIDTH = 1200;
const BOX_HEIGHT = 1100;
const FIRST_LINE_HEIGHT = 150;
const BORDER_BOX_MARGIN = 50;
const BOX_COLUMN_MARGIN = 390;

const boxCordinates: Coordinates = {
  x: 0,
  y: 0,
};

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
        BORDER_BOX_MARGIN * 2,
      y: () => app.auction.nextTipCoordinates?.y - 240,
      info: MULTI_SELLER_CONFIG.SSP_X.info,
      sspWebsite: publisherData[publisher].ssps[0][1],
      ssp: publisherData[publisher].ssps[0][0],
      config: {
        bidValue: '$10',
      },
    },
    {
      title: 'Component Auction',
      x: () => app.auction.nextTipCoordinates?.x + BOX_COLUMN_MARGIN + 106.5,
      y: () =>
        app.auction.nextTipCoordinates?.y -
        BOX_HEIGHT +
        BORDER_BOX_MARGIN * 2 +
        15,
      sspWebsite: publisherData[publisher].ssps[1][1],
      info: MULTI_SELLER_CONFIG.SSP_X.info,
      ssp: publisherData[publisher].ssps[1][0],
      config: {
        bidValue: '$8',
      },
    },
    {
      title: 'Component Auction',
      x: () => app.auction.nextTipCoordinates?.x + BOX_COLUMN_MARGIN + 106.5,
      y: () =>
        app.auction.nextTipCoordinates?.y -
        BOX_HEIGHT +
        BORDER_BOX_MARGIN * 2 +
        15,
      sspWebsite: publisherData[publisher].ssps[2][1],
      info: MULTI_SELLER_CONFIG.SSP_X.info,
      ssp: publisherData[publisher].ssps[2][0],
      config: {
        bidValue: '$6',
      },
    },
  ];

  setUpComponentAuctionStarter(componentAuctions, steps);

  componentAuctions.forEach((componentAuction) => {
    setUpComponentAuction(steps, componentAuction, componentAuction.config);
  });

  setUpTPoint(steps);

  setupAfterComponentAuctionFlow(steps);
};

const setUpComponentAuctionStarter = (componentAuctions, steps) => {
  // This callback does not update the app.auction.nextTipCoordinates.
  // TODO: Update the return value callbacks in this function, this change will affect the whole flow coordinates. So recalculate the coordinates.

  let returnCoordinates: Coordinates;

  const getStartingCoordinates = (index: number): Coordinates => {
    if (index === 0) {
      return app.auction.nextTipCoordinates;
    }

    return returnCoordinates;
  };

  const renderBoxes = ({ title, ssp }, index) => {
    steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () =>
          getStartingCoordinates(index).x -
          BOX_WIDTH / 2 +
          BORDER_BOX_MARGIN * 2,
        y1: () => getStartingCoordinates(index).y - 275,
        customHeight: 20,
        noArrow: true,
      },
    });

    steps.push({
      component: Text,
      props: {
        text: title,
        x: () =>
          getStartingCoordinates(index).x -
          BOX_WIDTH / 2 +
          BORDER_BOX_MARGIN * 2,
        y: () => getStartingCoordinates(index).y - 240,
      },
      delay: 1000,
      callBack: (returnValue) => {
        returnCoordinates = returnValue;
      },
    });

    steps.push({
      component: Box,
      props: {
        title: ssp,
        x: () => returnCoordinates?.x - BORDER_BOX_MARGIN - 12,
        y: () => returnCoordinates?.y + 20,
      },
      delay: 1000,
      callBack: () => {
        returnCoordinates = {
          x: app.auction.nextTipCoordinates?.x + 500 * (index + 1),
          y: app.auction.nextTipCoordinates?.y,
        };
      },
    });
  };

  // Create a line that span over the boxes
  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () => app.auction.nextTipCoordinates?.x - 500,
      y1: () => app.auction.nextTipCoordinates?.y - 275,
      customWidth: 1000,
      noArrow: true,
      isBranch: true,
    },
  });

  componentAuctions.forEach((componentAuction, index) => {
    renderBoxes(componentAuction, index);
  });
};

const setUpComponentAuction = (
  steps,
  { title, x, y, ssp, info },
  { bidValue }
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
      x: () => app.auction.nextTipCoordinates?.x - BORDER_BOX_MARGIN - 12,
      y: () => app.auction.nextTipCoordinates?.y + 20,
      info,
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

  setUpRunadAuction(steps);

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

const setUpTPoint = (steps: AuctionStep[]) => {
  steps.push({
    component: ProgressLine,
    props: {
      direction: 'left',
      x1: () => app.auction.nextTipCoordinates?.x - 25,
      y1: () => app.auction.nextTipCoordinates?.y,
      customWidth: BOX_COLUMN_MARGIN + 60,
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
      x1: () => app.auction.nextTipCoordinates?.x - 50,
      y1: () => app.auction.nextTipCoordinates?.y,
      customWidth: BOX_COLUMN_MARGIN + 60,
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
      x1: () => app.auction.nextTipCoordinates?.x + BOX_COLUMN_MARGIN + 85,
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
      title: MULTI_SELLER_CONFIG.SCORE_AD.title,
      description: '(by Pub AdServer)',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + arrowSize,
      info: MULTI_SELLER_CONFIG.SCORE_AD.info,
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
      title: MULTI_SELLER_CONFIG.REPORT_WIN.title,
      info: MULTI_SELLER_CONFIG.REPORT_WIN.info,
      description: MULTI_SELLER_CONFIG.REPORT_WIN.description,
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + arrowSize,
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
      title: MULTI_SELLER_CONFIG.REPORT_RESULT.title,
      info: MULTI_SELLER_CONFIG.REPORT_RESULT.info,
      description: MULTI_SELLER_CONFIG.REPORT_RESULT.description,
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
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
      }
    },
  });
};

export default setUpComponentAuctions;

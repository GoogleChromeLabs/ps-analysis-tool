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
import { Box, Custom, ProgressLine, Text } from '../../../components';
import setUpRunadAuction from '../setUpRunadAuction';
import { MULTI_SELLER_CONFIG } from '../../flowConfig.tsx';
import { getCoordinateValues } from '../../../utils/getCoordinateValues.ts';
import type {
  AuctionStep,
  Coordinates,
  CoordinateValue,
} from '../../../types.ts';

const BOX_WIDTH = 1200;
const BOX_HEIGHT = 1100;
const FIRST_LINE_HEIGHT = 150;
const BORDER_BOX_MARGIN = 50;
const BOX_COLUMN_MARGIN = 390;

const boxCordinates: Coordinates = {
  x: 0,
  y: 0,
};

const setUpComponentAuctions = (steps: AuctionStep[], index: number) => {
  const { box } = config.flow;
  const publisher = config.timeline.circles[index].website;

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y + box.height - 12,
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
        boxCordinates.x =
          getCoordinateValues(app.auction.nextTipCoordinates).x - BOX_WIDTH / 2;
        return boxCordinates.x;
      },
      y: () => {
        boxCordinates.y = getCoordinateValues(app.auction.nextTipCoordinates).y;
        return boxCordinates.y;
      },
      borderStroke: [0, 0, 0, 0],
    },
    delay: 1000,
    callBack: (returnValue) => {
      if (returnValue.down) {
        app.auction.nextTipCoordinates = returnValue.down;
      }
    },
  });

  const componentAuctions = [
    {
      title: 'Component Auction',
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x -
        BOX_WIDTH / 2 +
        BORDER_BOX_MARGIN * 2,
      y: () => getCoordinateValues(app.auction.nextTipCoordinates).y - 240,
      info: MULTI_SELLER_CONFIG.SSP_X.info,
      sspWebsite: publisherData[publisher].ssps[0][1],
      ssp: publisherData[publisher].ssps[0][0],
      config: {
        bidValue: '$10',
      },
    },
    {
      title: 'Component Auction',
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x +
        BOX_COLUMN_MARGIN +
        106.5,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y -
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
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x +
        BOX_COLUMN_MARGIN +
        106.5,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y -
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
          getCoordinateValues(getStartingCoordinates(index)).x -
          BOX_WIDTH / 2 +
          BORDER_BOX_MARGIN * 2,
        y1: () => getCoordinateValues(getStartingCoordinates(index)).y - 275,
        customHeight: 20,
        noArrow: true,
      },
    });

    steps.push({
      component: Text,
      props: {
        text: title,
        x: () =>
          getCoordinateValues(getStartingCoordinates(index)).x -
          BOX_WIDTH / 2 +
          BORDER_BOX_MARGIN * 2,
        y: () => getCoordinateValues(getStartingCoordinates(index)).y - 240,
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
        x: () =>
          getCoordinateValues(returnCoordinates).x - BORDER_BOX_MARGIN - 12,
        y: () => getCoordinateValues(returnCoordinates).y + 20,
      },
      delay: 1000,
      callBack: () => {
        returnCoordinates = {
          x:
            getCoordinateValues(app.auction.nextTipCoordinates).x +
            500 * (index + 1),
          y: getCoordinateValues(app.auction.nextTipCoordinates).y,
        };
      },
    });
  };

  // Create a line that span over the boxes
  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x - 500,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y - 275,
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
  steps: AuctionStep[],
  {
    title,
    x,
    y,
    ssp,
    info,
    sspWebsite,
  }: {
    title: string;
    x: CoordinateValue;
    y: CoordinateValue;
    ssp: string;
    info: React.JSX.Element;
    sspWebsite: string;
  },
  { bidValue }: { bidValue: string },
  index?: number
) => {
  const { box, arrowSize } = config.flow;

  steps.push({
    component: Text,
    props: {
      text: title,
      ssp: sspWebsite,
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
      ssp: sspWebsite,
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x -
        BORDER_BOX_MARGIN -
        12,
      y: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 20,
      info,
    },
    delay: 1000,
    callBack: (returnValue) => {
      if (returnValue.down) {
        const { x: xValue, y: yValue } = getCoordinateValues(returnValue.down);
        app.auction.nextTipCoordinates = {
          x: xValue,
          y: yValue + box.height - arrowSize,
        };
      }
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y,
    },
    callBack: (returnValue) => {
      if (returnValue.down) {
        const { x: xValue, y: yValue } = getCoordinateValues(returnValue.down);
        app.auction.nextTipCoordinates = {
          x: xValue - box.width / 2 - 10,
          y: yValue + box.height / 2 + arrowSize,
        };
      }
    },
  });

  setUpRunadAuction(
    steps,
    () => {
      return {
        component: Custom,
        props: {
          render: () => {
            const p = app.p;

            if (index === 2 && p) {
              const { x: xValue, y: yValue } =
                getCoordinateValues(boxCordinates);
              p.push();
              p.noFill();
              p.rect(xValue, yValue, BOX_WIDTH, BOX_HEIGHT);
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
          if (returnValue.down) {
            const { x: xValue, y: yValue } = getCoordinateValues(
              returnValue.down
            );
            app.auction.nextTipCoordinates = {
              x: xValue,
              y: yValue + box.height - arrowSize,
            };
          }
        },
      } as AuctionStep;
    },
    sspWebsite
  );

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y +
        box.height -
        arrowSize,
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
      x: () => getCoordinateValues(app.auction.nextTipCoordinates).x,
      y: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 15,
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
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x - 25,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y,
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
      x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x - 50,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y,
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
      x1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x +
        BOX_COLUMN_MARGIN +
        85,
      y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 20,
      customHeight: 100,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });
};

const setupAfterComponentAuctionFlow = (steps: AuctionStep[]) => {
  const { box, arrowSize } = config.flow;

  steps.push({
    component: Box,
    props: {
      title: MULTI_SELLER_CONFIG.SCORE_AD.title,
      description: '(by Pub AdServer)',
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y + arrowSize,
      info: MULTI_SELLER_CONFIG.SCORE_AD.info,
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
      y1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y +
        box.height -
        arrowSize,
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
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y + arrowSize,
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
      y1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y +
        box.height -
        arrowSize,
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
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y + arrowSize,
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
      direction: 'right',
      x1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x +
        box.width / 2 +
        1,
      y1: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y + arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'Show Winning Ad',
      x: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).x + arrowSize,
      y: () =>
        getCoordinateValues(app.auction.nextTipCoordinates).y -
        box.height / 2 +
        1,
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

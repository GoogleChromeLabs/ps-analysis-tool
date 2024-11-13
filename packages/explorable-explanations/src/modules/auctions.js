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
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import { Box, ProgressLine, Branches } from '../components';

const auction = {};

auction.setupAuctions = () => {
  config.timeline.circles.forEach((circle, index) => {
    auction.setUp(index);
  });
};

auction.setUp = (index) => {
  const { circles } = config.timeline;
  const { box } = config.flow;
  const currentCircle = circles[index];

  const { x, y } = flow.getTimelineCircleCoordinates(index);

  if (currentCircle.type !== 'publisher') {
    app.auction.auctions.push(null);
    return;
  }

  const steps = [];

  // Setup Ad unit codes
  steps.push({
    component: Branches,
    props: {
      x1: x,
      y1: y,
      branches: [
        {
          title: 'adunit-code',
          content: 'div-200-1',
          type: 'box',
        },
        {
          title: 'adunit-code',
          content: 'div-200-1',
          type: 'box',
        },
        {
          title: 'adunit-code',
          content: 'div-200-1',
          type: 'box',
        },
      ],
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue[1];
    },
  });

  // Setup Branches
  steps.push({
    component: Branches,
    props: {
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => app.auction.nextTipCoordinates.y + 40,
      branches: [
        {
          date: '2024-10-02',
          time: '10:00:22PM',
          type: 'datetime',
        },
        {
          date: '2024-10-03',
          time: '11:00:22PM',
          type: 'datetime',
        },
        {
          date: '2024-10-03',
          time: '11:00:22PM',
          type: 'datetime',
        },
      ],
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue[1];
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => app.auction.nextTipCoordinates.y + 40,
      noArrow: true,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'SSP Tag',
      x: () => app.auction.nextTipCoordinates.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates.y,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => app.auction.nextTipCoordinates.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'SSP',
      x: () => app.auction.nextTipCoordinates.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates.y + config.flow.arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => app.auction.nextTipCoordinates.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'DSPs',
      x: () => app.auction.nextTipCoordinates.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates.y + config.flow.arrowSize,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates.x + 10,
      y1: () => {
        return app.auction.nextTipCoordinates.y - 15;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates.x,
      y1: () => {
        return app.auction.nextTipCoordinates.y - box.height - 10;
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
      x1: () => app.auction.nextTipCoordinates.x - 10 + box.width / 2,
      y1: () => {
        return app.auction.nextTipCoordinates.y - 10 - box.height / 2;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'runAdAuction',
      x: () => app.auction.nextTipCoordinates.x + 10,
      y: () => app.auction.nextTipCoordinates.y - box.height / 2,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  const boxes = [
    'Load Interest Group',
    'Key/Value DSP Server',
    'generateBid()',
    'Key/Value SSP Server',
    'scoreAd()',
    'reportWin()',
    'reportResult()',
  ];

  boxes.forEach((title) => {
    steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () => app.auction.nextTipCoordinates.x,
        y1: () => {
          return app.auction.nextTipCoordinates.y + box.height - 10;
        },
      },
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue;
      },
    });

    steps.push({
      component: Box,
      props: {
        title,
        x: () => app.auction.nextTipCoordinates.x - box.width / 2,
        y: () => app.auction.nextTipCoordinates.y + 10,
      },
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue.down;
      },
    });
  });

  app.auction.auctions.push(steps);
};

auction.draw = async (index) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);

  const steps = app.auction.auctions[index];

  if (!steps) {
    return;
  }

  for (const step of steps) {
    const { component, props, callBack } = step;
    const returnValue = await component(props); // eslint-disable-line no-await-in-loop
    const delay = component === Box ? 1000 : 0;

    if (callBack) {
      callBack(returnValue);
    }

    await utils.delay(delay); // eslint-disable-line no-await-in-loop
  }

  flow.clearBelowTimelineCircles();
};

export default auction;

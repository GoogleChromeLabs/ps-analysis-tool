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
import * as utils from '../utils';
import { Box, ProgressLine, Branches, RippleEffect } from '../components';
import bubbles from './bubbles';
import promiseQueue from '../lib/promiseQueue.js';

/**
 * @module Auction
 * Handles the setup and rendering of auction steps in a flowchart-like interface.
 */
const auction = {};

/**
 * Initializes auction setup for all circles defined in the configuration.
 * Loops through each circle and sets up the auction steps.
 */
auction.setupAuctions = () => {
  config.timeline.circles.forEach((circle, index) => {
    auction.setUp(index);
  });
};

/**
 * Sets up the auction steps for a specific circle index.
 * Adds steps and coordinates for rendering components like Boxes, ProgressLines, and Branches.
 * @param {number} index - The index of the circle to set up.
 */
auction.setUp = (index) => {
  const { circles } = config.timeline;
  const { box, colors } = config.flow;
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
      currentIndex: index,
      branches: [
        {
          title: 'adunit-code',
          description: 'div-200-1',
          type: 'box',
          color: colors.box.browser,
        },
        {
          title: 'adunit-code',
          description: 'div-200-1',
          type: 'box',
          color: colors.box.browser,
        },
        {
          title: 'adunit-code',
          description: 'div-200-1',
          type: 'box',
          color: colors.box.browser,
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
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
      currentIndex: index,
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
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
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
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'SSP',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + config.flow.arrowSize,
      color: colors.box.noData,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'down',
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => app.auction.nextTipCoordinates?.y + 40,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'DSPs',
      x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
      y: () => app.auction.nextTipCoordinates?.y + config.flow.arrowSize,
      color: colors.box.noData,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'up',
      x1: () => app.auction.nextTipCoordinates?.x + 10,
      y1: () => {
        return app.auction.nextTipCoordinates?.y - 15;
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
      x1: () => app.auction.nextTipCoordinates?.x,
      y1: () => {
        return app.auction.nextTipCoordinates?.y - box.height - 10;
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
      x1: () => app.auction.nextTipCoordinates?.x - 10 + box.width / 2,
      y1: () => {
        return app.auction.nextTipCoordinates?.y - 10 - box.height / 2;
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
      x: () => app.auction.nextTipCoordinates?.x + 10,
      y: () => app.auction.nextTipCoordinates?.y - box.height / 2,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  const boxes = [
    {
      title: 'Load Interest Group',
      extraProps: {
        showBarrageAnimation: true,
      },
    },
    {
      title: 'Key/Value Trusted',
      description: 'DSP Server',
      color: colors.box.notBrowser,
    },
    {
      title: 'generateBid()',
      description: '(from DSPs on dsp.js)',
      color: colors.box.notBrowser,
      extraProps: {
        showRippleEffect: true,
      },
    },
    {
      title: 'DSP 1',
    },
    {
      title: 'DSP 2',
    },
    {
      title: 'Key/Value Trusted',
      description: 'SSP Server',
    },
    {
      title: 'scoreAd()',
      description: '(by SSPs on ssp.js)',
    },
    {
      title: 'reportWin()',
      description: '(on dsp.js)',
      color: colors.box.notBrowser,
    },
    {
      title: 'reportResult()',
      description: '(on ssp.js)',
    },
  ];

  boxes.forEach(({ title, description, color, extraProps = {} }) => {
    if (title === 'DSP 1') {
      steps.push({
        component: ProgressLine,
        props: {
          direction: 'right',
          x1: () => app.auction.nextTipCoordinates?.x + box.width / 2,
          y1: () => {
            return app.auction.nextTipCoordinates?.y - box.height / 2 + 15;
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
          x: () => app.auction.nextTipCoordinates?.x + 10,
          y: () => app.auction.nextTipCoordinates?.y - box.height + 15,
          color,
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue.down;
        },
      });

      steps.push({
        component: ProgressLine,
        props: {
          direction: 'left',
          text: '$20',
          x1: () => app.auction.nextTipCoordinates?.x + box.width / 4 + 5,
          y1: () => {
            return app.auction.nextTipCoordinates?.y + 25;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue;
        },
      });
      return;
    }

    if (title === 'DSP 2') {
      steps.push({
        component: ProgressLine,
        props: {
          direction: 'right',
          x1: () => app.auction.nextTipCoordinates?.x - 7,
          y1: () => {
            return app.auction.nextTipCoordinates?.y + box.height / 2 - 5;
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
          x: () => app.auction.nextTipCoordinates?.x + 10,
          y: () => app.auction.nextTipCoordinates?.y,
          color,
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = returnValue.down;
        },
      });

      steps.push({
        component: ProgressLine,
        props: {
          direction: 'left',
          text: '$10',
          x1: () => app.auction.nextTipCoordinates?.x + box.width / 4 + 5,
          y1: () => {
            return app.auction.nextTipCoordinates?.y + 15 - box.height / 2;
          },
        },
        callBack: (returnValue) => {
          app.auction.nextTipCoordinates = {
            x: returnValue.x - box.width / 2 - 10,
            y: returnValue.y - (box.height / 4) * 3,
          };
        },
      });
      return;
    }

    steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () => app.auction.nextTipCoordinates?.x,
        y1: () => {
          return app.auction.nextTipCoordinates?.y + box.height - 10;
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
        description,
        ...extraProps,
        x: () => app.auction.nextTipCoordinates?.x - box.width / 2,
        y: () => app.auction.nextTipCoordinates?.y + 10,
        color,
      },
      callBack: (returnValue) => {
        app.auction.nextTipCoordinates = returnValue.down;
      },
    });
  });

  steps.push({
    component: ProgressLine,
    props: {
      direction: 'right',
      x1: () => app.auction.nextTipCoordinates?.x + box.width / 2,
      y1: () => {
        return app.auction.nextTipCoordinates?.y + 10;
      },
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue;
    },
  });

  steps.push({
    component: Box,
    props: {
      title: 'Show Winning Ad',
      x: () => app.auction.nextTipCoordinates?.x + 10,
      y: () => app.auction.nextTipCoordinates?.y - box.height / 2,
    },
    callBack: (returnValue) => {
      app.auction.nextTipCoordinates = returnValue.down;
    },
  });

  app.auction.auctions.push(steps);
};

/**
 * Draws the auction steps for a specific index asynchronously.
 * Each step is rendered sequentially with delays.
 * @param {number} index - The index of the auction steps to draw.
 */
auction.draw = (index) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);

  const steps = app.auction.auctions[index];

  if (!steps) {
    return;
  }

  for (const step of steps) {
    promiseQueue.nextStepSkipIndex.push(promiseQueue.queue.length - 1);
    promiseQueue.add(async () => {
      const { component, props, callBack } = step;

      const returnValue = await component(props); // eslint-disable-line no-await-in-loop

      const delay = component === Box ? 1000 : 0;
      if (!app.isRevisitingNodeInInteractiveMode) {
        if (props?.showBarrageAnimation) {
          await bubbles.barrageAnimation(index); // eslint-disable-line no-await-in-loop

          if (app.cancelPromise) {
            return;
          }

          await utils.delay(500); // eslint-disable-line no-await-in-loop

          utils.wipeAndRecreateInterestCanvas(); // eslint-disable-line no-await-in-loop
        }

        if (props?.showRippleEffect) {
          const x = props.x();
          const y = props.y();

          if (app.cancelPromise) {
            return;
          }
          // eslint-disable-next-line no-await-in-loop
          await RippleEffect({
            x: x + config.flow.box.width + 2,
            y: y + config.flow.box.height / 2,
          });
        }
      }

      if (callBack) {
        callBack(returnValue);
      }

      if (!app.isRevisitingNodeInInteractiveMode) {
        if (app.cancelPromise) {
          return;
        }
        await utils.delay(delay); // eslint-disable-line no-await-in-loop
      }
    });
  }

  promiseQueue.add(() => {
    if (!app.isRevisitingNodeInInteractiveMode || !app.isInteractiveMode) {
      flow.clearBelowTimelineCircles();
    }
  });
};

export default auction;

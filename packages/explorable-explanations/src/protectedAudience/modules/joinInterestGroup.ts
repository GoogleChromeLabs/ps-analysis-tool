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
import { Box, ProgressLine } from '../components';
import bubbles from './bubbles';
import { ADVERTIZER_CONFIG } from './flowConfig';
import { AuctionStep } from '../types';
import { getCoordinateValues } from '../utils/getCoordinateValues';

type JoinInterestGroup = {
  joinings: AuctionStep[][];
  setupJoinings: () => void;
  setUp: (index: number) => void;
  draw: (index: number) => void;
};

const ARROW_SIZE = 10;

/**
 * @module joinInterestGroup
 * Handles the setup and rendering of joining steps for advertisers in a flowchart-like interface.
 */
const joinInterestGroup: JoinInterestGroup = {
  joinings: [],
  /**
   * Initializes the joining setup for all circles in the timeline.
   * Loops through each circle and sets up joining steps.
   */
  setupJoinings: () => {
    config.timeline.circles.forEach((circle, index) => {
      joinInterestGroup.setUp(index);
    });
  },

  /**
   * Sets up the joining steps for a specific circle index.
   * Adds steps and coordinates for rendering components like Boxes and ProgressLines.
   * @param {number} index - The index of the circle in the timeline to set up.
   */
  setUp: (index: number) => {
    const { circles } = config.timeline;
    const { box } = config.flow;
    const currentCircle = circles[index];

    const { x, y } = flow.getTimelineCircleCoordinates(index);

    if (currentCircle.type !== 'advertiser') {
      app.joinInterestGroup.joinings.push([]);
      return;
    }

    const steps: AuctionStep[] = [];

    // Add a downward progress line
    steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: x,
        y1: y,
      },
      callBack: (returnValue) => {
        app.joinInterestGroup.nextTipCoordinates = returnValue;
      },
    });

    // Add DSP Tag Box
    steps.push({
      component: Box,
      props: {
        title: ADVERTIZER_CONFIG.DSP_TAGS.title,
        x: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).x -
          box.width / 2,
        y: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).y +
          ARROW_SIZE,
        info: ADVERTIZER_CONFIG.DSP_TAGS.info,
      },
      delay: 1000,
      callBack: (returnValue) => {
        if (returnValue.down) {
          app.joinInterestGroup.nextTipCoordinates = returnValue.down;
        }
      },
    });

    // Add another downward progress line
    steps.push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).x,
        y1: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).y + 40,
      },
      callBack: (returnValue) => {
        app.joinInterestGroup.nextTipCoordinates = returnValue;
      },
    });

    // Add DSPs Box
    steps.push({
      component: Box,
      props: {
        title: ADVERTIZER_CONFIG.DSPS.title,
        x: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).x -
          box.width / 2,
        y: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).y +
          config.flow.arrowSize,
        color: config.flow.colors.box.notBrowser,
        info: ADVERTIZER_CONFIG.DSPS.info,
      },
      delay: 1000,
      callBack: (returnValue) => {
        if (returnValue.down) {
          app.joinInterestGroup.nextTipCoordinates = returnValue.down;
        }
      },
    });

    // Add upward progress line
    steps.push({
      component: ProgressLine,
      props: {
        direction: 'up',
        x1: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).x + 10,
        y1: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).y - 15,
      },
      delay: 1000,
      callBack: (returnValue) => {
        app.joinInterestGroup.nextTipCoordinates = returnValue;
      },
    });

    // Add upward progress line with text
    steps.push({
      component: ProgressLine,
      props: {
        direction: 'up',
        x1: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).x,
        y1: () =>
          getCoordinateValues(app.joinInterestGroup.nextTipCoordinates).y -
          10 -
          box.height,
        text: 'joinInterestGroup()',
      },
      delay: 1000,
      callBack: (returnValue) => {
        app.joinInterestGroup.nextTipCoordinates = returnValue;
      },
    });

    app.joinInterestGroup.joinings.push(steps);
  },

  /**
   * Draws the joining steps for a specific circle index asynchronously.
   * Each step is rendered sequentially with delays.
   * @param {number} index - The index of the circle in the timeline to draw.
   */
  draw: (index: number) => {
    if (!app.p) {
      return;
    }
    app.p.textAlign(app.p.CENTER, app.p.CENTER);

    const steps = app.joinInterestGroup.joinings[index];

    if (!steps.length) {
      return;
    }

    app.promiseQueue?.push((cb) => {
      if (
        index > 1 &&
        config.timeline.circles[index - 1].type === 'publisher'
      ) {
        app.setCurrentSite(config.timeline.circles[index - 2]);
      }

      cb?.(undefined, true);
    });

    app.promiseQueue?.push((cb) => {
      if (app.p && !app.isInteractiveMode) {
        const circleItem = config.timeline.circles[index];
        const { diameter, verticalSpacing } = config.timeline.circleProps;
        const circleVerticalSpace = verticalSpacing + diameter;
        const xPositionForCircle =
          config.timeline.position.x +
          diameter / 2 +
          circleVerticalSpace * index;

        app.p.push();
        app.p.fill(config.timeline.colors.black);
        app.p.textSize(12);
        app.p.strokeWeight(0.1);
        app.p.textFont('sans-serif');
        app.p.text(
          circleItem.datetime,
          xPositionForCircle,
          config.timeline.position.y
        );
        app.p.pop();
      }

      cb?.(undefined, true);
    });

    for (const step of steps) {
      app.promiseQueue?.push(async (cb) => {
        const { component, props, callBack, delay } = step;
        const returnValue = await component?.(props); // eslint-disable-line no-await-in-loop

        if (callBack) {
          callBack(returnValue);
        }

        if (!app.isRevisitingNodeInInteractiveMode && delay) {
          await utils.delay(delay / app.speedMultiplier); // eslint-disable-line no-await-in-loop
        }
        cb?.(undefined, true);
      });
    }

    app.promiseQueue?.push(async (cb) => {
      if (!app.isRevisitingNodeInInteractiveMode) {
        const { x, y } =
          app.timeline.circlePositions[app.timeline.currentIndex];

        const { x: x1, y: y1 } = utils.getCoordinateValues({ x, y });
        utils.scrollToCoordinates({ x: x1, y: y1 });

        await bubbles.reverseBarrageAnimation(index);
        app.setCurrentSite(config.timeline.circles[index]);
      }

      if (app.bubbles.isExpanded) {
        bubbles.showExpandedBubbles();
      } else {
        bubbles.showMinifiedBubbles();
      }
      cb?.(undefined, true);
    });

    app.promiseQueue?.push((cb) => {
      if (!app.isRevisitingNodeInInteractiveMode && !app.isInteractiveMode) {
        flow.clearBelowTimelineCircles();
        app.timeline.infoIconsPositions = [];
      }
      cb?.(undefined, true);
    });
  },
};

export default joinInterestGroup;

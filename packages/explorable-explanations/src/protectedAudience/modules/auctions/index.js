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
import flow from '../flow';
import app from '../../app';
import config from '../../config';
import * as utils from '../../utils';
import { RippleEffect } from '../../components';
import bubbles from '../bubbles';
import setUpSingleSellerFirstSSPTagFlow from './single-seller/setupFirstSSPTagFlow';
import setUpMultiSellerFirstSSPTagFlow from './multi-seller/setUpFirstSSPTagFlow';
import setUpPublisherAdServerFlow from './multi-seller/setUpPublisherAdServerFlow';
import setUpComponentAuctions from './multi-seller/setUpComponentAuctions';
import setUpRunadAuction from './setUpRunadAuction';
import setUpAdUnitCode from './setUpAdUnitCode';
import setupBranches from './setupBranches';
import setupShowWinningAd from './setupShowWinningAd';

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
  const currentCircle = circles[index];

  if (currentCircle.type !== 'publisher') {
    app.auction.auctions.push(null);
    return;
  }

  app.isMultiSeller = true;

  const steps = [];

  setUpAdUnitCode(steps, index);
  setupBranches(steps, index);

  if (app.isMultiSeller) {
    setUpMultiSellerFirstSSPTagFlow(steps);
    setUpPublisherAdServerFlow(steps);
    setUpComponentAuctions(steps);
  } else {
    setUpSingleSellerFirstSSPTagFlow(steps);
    setUpRunadAuction(steps);
    setupShowWinningAd(steps);
  }

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

  app.promiseQueue.push((cb) => {
    app.setCurrentSite(config.timeline.circles[index]);

    cb(null, true);
  });

  for (const step of steps) {
    app.promiseQueue.push(async (cb) => {
      const { component, props, callBack, delay = 0 } = step;

      const returnValue = await component(props); // eslint-disable-line no-await-in-loop

      if (!app.isRevisitingNodeInInteractiveMode) {
        if (props?.showBarrageAnimation) {
          await bubbles.barrageAnimation(index); // eslint-disable-line no-await-in-loop

          if (app.cancelPromise) {
            return;
          }

          await utils.delay(500 / app.speedMultiplier); // eslint-disable-line no-await-in-loop

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

        await utils.delay(delay / app.speedMultiplier); // eslint-disable-line no-await-in-loop
      }
      cb(null, true);
    });
  }

  app.promiseQueue.push((cb) => {
    if (!app.isRevisitingNodeInInteractiveMode || !app.isInteractiveMode) {
      flow.clearBelowTimelineCircles();
    }
    cb(null, true);
  });
};

export default auction;

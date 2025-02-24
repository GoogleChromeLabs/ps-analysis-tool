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
import { showWinningAdDirectly } from './showWinningAdDirectly';
import { getCoordinateValues } from '../../utils/getCoordinateValues';
import { MULTI_SELLER_CONFIG } from '../flowConfig';
export type Auction = {
  setupAuctions: () => void;
  setUp: (index: number) => void;
  draw: (index: number) => void;
};

/**
 * @module Auction
 * Handles the setup and rendering of auction steps in a flowchart-like interface.
 */
const auction: Auction = {
  /**
   * Initializes auction setup for all circles defined in the configuration.
   * Loops through each circle and sets up the auction steps.
   */
  setupAuctions: () => {
    app.auction.auctions = [];
    config.timeline.circles.forEach((circle, index) => {
      auction.setUp(index);
    });
  },

  /**
   * Sets up the auction steps for a specific circle index.
   * Adds steps and coordinates for rendering components like Boxes, ProgressLines, and Branches.
   * @param {number} index - The index of the circle to set up.
   */
  setUp: (index: number) => {
    const { circles } = config.timeline;
    const currentCircle = circles[index];

    if (currentCircle.type !== 'publisher') {
      app.auction.auctions.push([]);
      return;
    }

    const steps = [];

    setUpAdUnitCode(steps, index);
    setupBranches(steps, index);

    if (app.isMultiSeller) {
      setUpMultiSellerFirstSSPTagFlow(steps);
      setUpPublisherAdServerFlow(steps);
      setUpComponentAuctions(steps, index);
    } else {
      setUpSingleSellerFirstSSPTagFlow(steps);
      setUpRunadAuction(steps);
      setupShowWinningAd(steps);
    }

    app.auction.auctions.push(steps);
  },

  /**
   * Draws the auction steps for a specific index asynchronously.
   * Each step is rendered sequentially with delays.
   * @param {number} index - The index of the auction steps to draw.
   */
  draw: (index: number) => {
    if (!app.p) {
      return;
    }

    app.p.textAlign(app.p.CENTER, app.p.CENTER);

    if (!app.auction.auctions[index].length) {
      return;
    }

    app.promiseQueue?.push((cb) => {
      app.setCurrentSite(config.timeline.circles[index]);

      cb?.(undefined, true);
    });

    for (const step of app.auction.auctions[index]) {
      app.promiseQueue?.push(async (cb) => {
        const { component, props, callBack, delay = 0 } = step;
        let ssp = '';

        if (props?.title) {
          if (props?.ssp) {
            ssp = props.ssp;
          } else {
            if (
              app.isMultiSeller &&
              [
                MULTI_SELLER_CONFIG.SCORE_AD.title,
                MULTI_SELLER_CONFIG.REPORT_WIN.title,
                MULTI_SELLER_CONFIG.REPORT_RESULT.title,
              ].includes(props.title)
            ) {
              ssp = 'https://www.' + config.timeline.circles[index].website;
            }
          }

          const stepInformation = {
            title: props.title,
            description: props.description || '',
            ssp,
          };

          app.setCurrentStep(stepInformation);
        }

        const returnValue = await component?.(props); // eslint-disable-line no-await-in-loop

        if (!app.isRevisitingNodeInInteractiveMode) {
          if (props?.showBarrageAnimation) {
            await bubbles.barrageAnimation(index); // eslint-disable-line no-await-in-loop

            if (app.cancelPromise) {
              cb?.(undefined, true);
              return;
            }

            await utils.delay(500 / app.speedMultiplier); // eslint-disable-line no-await-in-loop

            utils.wipeAndRecreateInterestCanvas(); // eslint-disable-line no-await-in-loop
          }

          if (props?.showRippleEffect) {
            const value = returnValue.down ? returnValue.down : returnValue;
            const { x, y } = getCoordinateValues(value);

            if (app.cancelPromise) {
              cb?.(undefined, true);
              return;
            }
            // eslint-disable-next-line no-await-in-loop
            await RippleEffect({
              x: x + config.flow.box.width / 2 + 10,
              y: y + config.flow.box.height / 2,
            });
          }
        }

        if (callBack) {
          callBack(returnValue);
        }

        if (!app.isRevisitingNodeInInteractiveMode) {
          if (app.cancelPromise) {
            cb?.(undefined, true);
            return;
          }

          await utils.delay(delay / app.speedMultiplier); // eslint-disable-line no-await-in-loop
        }

        showWinningAdDirectly(
          cb as (error: Error | null, success: boolean) => void,
          props,
          index,
          auction.draw,
          auction.setupAuctions
        );
        cb?.(undefined, true);
      });
    }

    app.promiseQueue?.push((cb) => {
      if (!app.isRevisitingNodeInInteractiveMode && !app.isInteractiveMode) {
        flow.clearBelowTimelineCircles();
        app.timeline.infoIconsPositions = [];
        app.setSelectedAdUnit('');
        app.setSelectedDateTime('');
      }
      cb?.(undefined, true);
    });
  },
};

export default auction;

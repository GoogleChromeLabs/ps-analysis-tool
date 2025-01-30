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
import { Box, ProgressLine, RippleEffect } from '../../components';
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
  app.auction.auctions = [];
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
};

/**
 * Draws the auction steps for a specific index asynchronously.
 * Each step is rendered sequentially with delays.
 * @param {number} index - The index of the auction steps to draw.
 */
auction.draw = (index) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);

  const { box, arrowSize } = config.flow;
  const {
    circleProps: { diameter },
    circles,
  } = config.timeline;

  if (!app.auction.auctions[index]) {
    return;
  }

  app.promiseQueue.push((cb) => {
    app.setCurrentSite(config.timeline.circles[index]);

    cb(null, true);
  });

  for (const step of app.auction.auctions[index]) {
    app.promiseQueue.push(async (cb) => {
      const { component, props, callBack, delay = 0 } = step;
      let ssp = '';

      if (props?.title) {
        if (props?.ssp) {
          ssp = props.ssp;
        } else {
          if (app.isMultiSeller && props.title === 'scoreAd()') {
            ssp = 'https://www.' + config.timeline.circles[index].website;
          }
        }

        const stepInformation = {
          title: props.title,
          description: props.description,
          ssp,
        };

        app.setCurrentStep(stepInformation);
      }

      const returnValue = await component(props); // eslint-disable-line no-await-in-loop

      if (!app.isRevisitingNodeInInteractiveMode) {
        if (props?.showBarrageAnimation) {
          await bubbles.barrageAnimation(index); // eslint-disable-line no-await-in-loop

          if (app.cancelPromise) {
            cb(null, true);
            return;
          }

          await utils.delay(500 / app.speedMultiplier); // eslint-disable-line no-await-in-loop

          utils.wipeAndRecreateInterestCanvas(); // eslint-disable-line no-await-in-loop
        }

        if (props?.showRippleEffect) {
          const x = props.x();
          const y = props.y();

          if (app.cancelPromise) {
            cb(null, true);
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
          cb(null, true);
          return;
        }

        await utils.delay(delay / app.speedMultiplier); // eslint-disable-line no-await-in-loop
      }

      if (
        props.title === 'runAdAuction()' &&
        app.bubbles.interestGroupCounts === 0
      ) {
        app.auction.auctions[index] = [];
        app.promiseQueue.end();

        app.auction.auctions[index].push({
          component: ProgressLine,
          props: {
            direction: 'right',
            x1: () => app.auction.nextTipCoordinates?.x + box.width / 2 + 1,
            y1: () => app.auction.nextTipCoordinates?.y + arrowSize,
          },
          callBack: (_returnValue) => {
            app.auction.nextTipCoordinates = _returnValue;
          },
        });

        app.auction.auctions[index].push({
          component: Box,
          props: {
            title: 'Show Winning Ad',
            x: () => app.auction.nextTipCoordinates?.x + arrowSize,
            y: () => app.auction.nextTipCoordinates?.y - box.height / 2 + 1,
          },
          delay: 1000,
          callBack: (_returnValue) => {
            app.auction.nextTipCoordinates = _returnValue.down;
          },
        });

        auction.draw(index);

        app.promiseQueue.push((_cb) => {
          if (app.isRevisitingNodeInInteractiveMode) {
            app.promiseQueue.push((__cb) => {
              app.shouldRespondToClick = true;
              app.isRevisitingNodeInInteractiveMode = false;

              if (circles[index].type === 'advertiser') {
                app.joinInterestGroup.joinings[index][0].props.y1 -= 20;
              } else {
                app.auction.auctions[index][0].props.y1 -= 20;
              }

              auction.setupAuctions();
              __cb(null, true);
            });
          } else {
            if (config.timeline.circles[index].visited) {
              app.visitedIndexOrder = app.visitedIndexOrder.filter(
                (indexes) => {
                  if (indexes === index) {
                    return false;
                  }
                  return true;
                }
              );

              app.visitedIndexOrder.push(index);

              config.timeline.circles[index].visitedIndex = app.visitedIndexes;
              app.visitedIndexes = 1;

              app.visitedIndexOrder.forEach((idx) => {
                config.timeline.circles[idx].visitedIndex = app.visitedIndexes;
                app.visitedIndexes++;
              });

              app.bubbles.positions.splice(
                -(circles[index].igGroupsCount ?? 0)
              );

              app.shouldRespondToClick = true;
              bubbles.showMinifiedBubbles();
              app.timeline.renderUserIcon();
              auction.setupAuctions();
              return;
            } else {
              const positions = app.timeline.circlePositions[index];
              app.timeline.expandIconPositions.push({
                x: positions.x,
                y: positions.y + diameter / 2,
                index: index,
              });

              app.visitedIndexOrder.push(index);
              if (app.visitedIndexOrderTracker < app.visitedIndexOrder.length) {
                app.visitedIndexOrderTracker = app.visitedIndexOrder.length - 1;
              }

              app.bubbles.interestGroupCounts +=
                circles[index]?.igGroupsCount ?? 0;
              config.timeline.circles[index].visited = true;
              config.timeline.circles[index].visitedIndex = app.visitedIndexes;
              app.visitedIndexes += 1;
            }

            bubbles.showMinifiedBubbles();
            app.shouldRespondToClick = true;

            utils.wipeAndRecreateUserCanvas();
            utils.wipeAndRecreateMainCanvas();
            app.timeline.renderUserIcon();
            flow.setButtonsDisabilityState();
            auction.setupAuctions();
          }
          _cb(null, true);
        });

        try {
          app.promiseQueue.start();
        } catch (error) {
          // Fail silently
        }
        cb(null, true);
        return;
      }
      cb(null, true);
    });
  }

  app.promiseQueue.push((cb) => {
    if (!app.isRevisitingNodeInInteractiveMode) {
      flow.clearBelowTimelineCircles();
      app.timeline.infoIconsPositions = [];
      app.setSelectedAdUnit(null);
      app.setSelectedDateTime(null);
    }
    cb(null, true);
  });
};

export default auction;

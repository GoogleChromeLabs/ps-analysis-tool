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
 * Internal dependencies
 */
import { Box, ProgressLine } from '../../components';
import app from '../../app';
import config from '../../config';
import bubbles from '../bubbles';
import {
  wipeAndRecreateMainCanvas,
  wipeAndRecreateUserCanvas,
} from '../../utils';
import flow from '../flow';

export const showWinningAdDirectly = (
  cb,
  props,
  index,
  auctionDraw,
  setupAuctions
) => {
  const { box, arrowSize } = config.flow;
  const {
    circleProps: { diameter },
    circles,
  } = config.timeline;

  if (app.isInteractiveMode) {
    return;
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

    auctionDraw(index);

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

          setupAuctions();
          __cb(null, true);
        });
      } else {
        if (config.timeline.circles[index].visited) {
          app.visitedIndexOrder = app.visitedIndexOrder.filter((indexes) => {
            if (indexes === index) {
              return false;
            }
            return true;
          });

          app.visitedIndexOrder.push(index);

          config.timeline.circles[index].visitedIndex = app.visitedIndexes;
          app.visitedIndexes = 1;

          app.visitedIndexOrder.forEach((idx) => {
            config.timeline.circles[idx].visitedIndex = app.visitedIndexes;
            app.visitedIndexes++;
          });

          app.bubbles.positions.splice(-(circles[index].igGroupsCount ?? 0));

          app.shouldRespondToClick = true;
          bubbles.showMinifiedBubbles();
          app.timeline.renderUserIcon();
          setupAuctions();
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

          app.bubbles.interestGroupCounts += circles[index]?.igGroupsCount ?? 0;
          config.timeline.circles[index].visited = true;
          config.timeline.circles[index].visitedIndex = app.visitedIndexes;
          app.visitedIndexes += 1;
        }

        bubbles.showMinifiedBubbles();
        app.shouldRespondToClick = true;

        wipeAndRecreateUserCanvas();
        wipeAndRecreateMainCanvas();
        app.timeline.renderUserIcon();
        flow.setButtonsDisabilityState();
        setupAuctions();
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
};

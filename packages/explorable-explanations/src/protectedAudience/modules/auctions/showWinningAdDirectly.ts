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
import { SINGLE_SELLER_CONFIG } from '../flowConfig.tsx';
import { AuctionStep } from '../../../types';
import { Auction } from '.';
import { getCoordinateValues } from '../../utils/getCoordinateValues.ts';

export const showWinningAdDirectly = (
  cb: (error: Error | null, success: boolean) => void,
  props: AuctionStep['props'],
  index: number,
  auctionDraw: Auction['draw'],
  setupAuctions: Auction['setupAuctions']
) => {
  const { box } = config.flow;
  const {
    circleProps: { diameter },
    circles,
  } = config.timeline;

  if (!app.isInteractiveMode) {
    return;
  }

  if (
    props?.title === 'runAdAuction()' &&
    app.bubbles.interestGroupCounts === 0
  ) {
    app.auction.auctions[index] = [];
    app.promiseQueue?.end();

    app.auction.auctions[index].push({
      component: ProgressLine,
      props: {
        direction: 'down',
        x1: () => getCoordinateValues(app.auction.nextTipCoordinates).x + 1,
        y1: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 40,
      },
      callBack: (_returnValue) => {
        app.auction.nextTipCoordinates = _returnValue;
      },
    });

    app.auction.auctions[index].push({
      component: Box,
      props: {
        title: SINGLE_SELLER_CONFIG.SHOW_WINNING_AD.title,
        info: SINGLE_SELLER_CONFIG.SHOW_WINNING_AD.info,
        x: () =>
          getCoordinateValues(app.auction.nextTipCoordinates).x - box.width / 2,
        y: () => getCoordinateValues(app.auction.nextTipCoordinates).y + 10,
      },
      delay: 1000,
      callBack: (_returnValue) => {
        if (_returnValue.down) {
          app.auction.nextTipCoordinates = _returnValue.down;
        }
      },
    });

    auctionDraw(index);

    app.promiseQueue?.push((_cb) => {
      if (app.isRevisitingNodeInInteractiveMode) {
        app.promiseQueue?.push((__cb) => {
          app.shouldRespondToClick = true;
          app.isRevisitingNodeInInteractiveMode = false;

          if (circles[index].type === 'advertiser') {
            // @ts-expect-error - TODO: fix this
            app.joinInterestGroup.joinings[index][0].props.y1 -= 20;
          } else if (app.auction.auctions[index][0].props?.y1) {
            let y1 = app.auction.auctions[index][0].props.y1;
            if (typeof y1 === 'number') {
              y1 -= 20;
              app.auction.auctions[index][0].props.y1 = y1;
            }
          }

          setupAuctions();
          __cb?.(undefined, true);
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
          const { x, y } = getCoordinateValues(positions);
          app.timeline.expandIconPositions.push({
            x,
            y: y + diameter / 2,
            index,
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
      _cb?.(undefined, true);
    });

    try {
      app.promiseQueue?.start();
    } catch (error) {
      // Fail silently
    }
    cb(null, true);
    return;
  }
};

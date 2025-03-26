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
import app from '../../app';
import config from '../../config';
import bubbles from '../../modules/bubbles';
import flow from '../../modules/flow';
import { drawOpenArrowWithoutAnimationIcon } from '../drawOpenArrowWithoutAnimationIcon';
import { isInsideCircle } from '../isInsideCircle';
import {
  wipeAndRecreateMainCanvas,
  wipeAndRecreateUserCanvas,
} from '../wipeAndRecreateCanvas';
import { getCoordinateValues } from '../getCoordinateValues';
const mouseClickedInInteractiveModeCallback = (drawCircle, renderUserIcon) => {
  const { mouseX, mouseY, isInteractiveMode, shouldRespondToClick } = app;
  const p = app.p;
  const up = app.up;

  if (!isInteractiveMode || !shouldRespondToClick) {
    return;
  }

  const { circlePositions, expandIconPositions } = app.timeline;
  const {
    circleProps: { diameter },
    circles,
    colors,
    user,
  } = config.timeline;

  let clickedIndex = -1;

  circlePositions.forEach(({ x, y }, index) => {
    const { x: xValue, y: yValue } = getCoordinateValues({ x, y });
    if (isInsideCircle(mouseX, mouseY, xValue, yValue, diameter / 2)) {
      clickedIndex = index;
    }
  });

  app.usedNextOrPrev = false;

  expandIconPositions.forEach(({ x, y, index }) => {
    const { x: xValue, y: yValue } = getCoordinateValues({ x, y });
    if (
      isInsideCircle(mouseX, mouseY, xValue, yValue + 10, 10) &&
      app.timeline.currentIndex !== index
    ) {
      app.isRevisitingNodeInInteractiveMode = true;
      clickedIndex = index;
    }
  });

  if (clickedIndex > -1 && !app.isRevisitingNodeInInteractiveMode) {
    app.promiseQueue?.end();
    flow.clearBelowTimelineCircles();

    app.shouldRespondToClick = false;
    app.timeline.currentIndex = clickedIndex;

    wipeAndRecreateUserCanvas();
    app.calculateDateTime(clickedIndex);
    renderUserIcon();
    bubbles.generateBubbles();
    app.nodeIndexRevisited = -1;
    drawOpenArrowWithoutAnimationIcon();

    if (circles[clickedIndex].visited) {
      app.promiseQueue?.push((cb) => {
        wipeAndRecreateUserCanvas();
        drawOpenArrowWithoutAnimationIcon();
        wipeAndRecreateMainCanvas();

        if (!p) {
          return;
        }

        p.push();
        p.stroke(colors.grey);

        circles.forEach((circle, index) => {
          p.push();
          p.stroke(colors.grey);
          drawCircle(
            index,
            circle.visited && index !== clickedIndex ? true : false
          );
          p.pop();

          if (circle.visited && index === clickedIndex && up) {
            const position = circlePositions[clickedIndex];
            const { x, y } = getCoordinateValues(position);
            up.image(
              p.userIcon,
              x - user.width / 2,
              y - user.height / 2,
              user.width,
              user.height
            );
          }
        });

        p.pop();
        cb?.(undefined, true);
      });
    }

    app.drawFlows(clickedIndex);

    app.promiseQueue?.push((cb) => {
      if (config.timeline.circles[clickedIndex].visited) {
        app.visitedIndexOrder = app.visitedIndexOrder.filter((indexes) => {
          if (indexes === clickedIndex) {
            return false;
          }
          return true;
        });

        app.visitedIndexOrder.push(clickedIndex);

        config.timeline.circles[clickedIndex].visitedIndex = app.visitedIndexes;
        app.visitedIndexes = 1;

        app.visitedIndexOrder.forEach((idx) => {
          config.timeline.circles[idx].visitedIndex = app.visitedIndexes;
          app.visitedIndexes++;
        });

        app.bubbles.positions.splice(
          -(circles[clickedIndex].igGroupsCount ?? 0)
        );

        app.shouldRespondToClick = true;
        bubbles.showMinifiedBubbles();
        wipeAndRecreateUserCanvas();
        renderUserIcon();
        drawOpenArrowWithoutAnimationIcon();
        return;
      } else {
        const positions = app.timeline.circlePositions[clickedIndex];
        const { x, y } = getCoordinateValues(positions);
        app.timeline.expandIconPositions.push({
          x,
          y: y + diameter / 2,
          index: clickedIndex,
        });

        app.visitedIndexOrder.push(clickedIndex);
        if (app.visitedIndexOrderTracker < app.visitedIndexOrder.length) {
          app.visitedIndexOrderTracker = app.visitedIndexOrder.length - 1;
        }

        app.bubbles.interestGroupCounts +=
          circles[clickedIndex]?.igGroupsCount ?? 0;
        config.timeline.circles[clickedIndex].visited = true;
        config.timeline.circles[clickedIndex].visitedIndex = app.visitedIndexes;
        app.visitedIndexes += 1;
      }

      bubbles.showMinifiedBubbles();
      app.shouldRespondToClick = true;

      wipeAndRecreateUserCanvas();
      renderUserIcon();
      drawOpenArrowWithoutAnimationIcon();
      flow.setButtonsDisabilityState();

      cb?.(undefined, true);
    });

    app.promiseQueue?.start();
  } else if (clickedIndex > -1 && app.isRevisitingNodeInInteractiveMode) {
    if (app.nodeIndexRevisited !== clickedIndex) {
      app.nodeIndexRevisited = clickedIndex;
      app.timeline.currentIndex = -1;
      renderUserIcon();
    } else {
      app.isRevisitingNodeInInteractiveMode = false;
      flow.clearBelowTimelineCircles();
      app.nodeIndexRevisited = -1;
      wipeAndRecreateUserCanvas();
      renderUserIcon();
      drawOpenArrowWithoutAnimationIcon();
      return;
    }
    app.promiseQueue?.end();
    flow.clearBelowTimelineCircles();

    if (circles[clickedIndex].type === 'advertiser') {
      // @ts-ignore
      app.joinInterestGroup.joinings[clickedIndex][0].props.y1 += 20;
    } else {
      // @ts-ignore
      app.auction.auctions[clickedIndex][0].props.y1 += 20;
    }

    app.shouldRespondToClick = false;
    app.drawFlows(clickedIndex);

    app.promiseQueue?.push((cb) => {
      app.shouldRespondToClick = true;
      app.isRevisitingNodeInInteractiveMode = false;

      if (circles[clickedIndex].type === 'advertiser') {
        // @ts-ignore
        app.joinInterestGroup.joinings[clickedIndex][0].props.y1 -= 20;
      } else {
        // @ts-ignore
        app.auction.auctions[clickedIndex][0].props.y1 -= 20;
      }
      renderUserIcon();
      cb?.(undefined, true);
    });

    app.promiseQueue?.start();
    wipeAndRecreateUserCanvas();
    renderUserIcon();
    drawOpenArrowWithoutAnimationIcon();

    return;
  }
};

export default mouseClickedInInteractiveModeCallback;

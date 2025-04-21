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
import flow from '../../modules/flow';
import { drawOpenArrowWithoutAnimationIcon } from '../drawOpenArrowWithoutAnimationIcon';
import { isInsideCircle } from '../isInsideCircle';
import { wipeAndRecreateUserCanvas } from '../wipeAndRecreateCanvas';
import { getCoordinateValues } from '../getCoordinateValues';

//Need to pass this from the caller to avoid circular dependencies
const mouseClickedInNonInteractiveModeCallback = (
  renderUserIcon: () => void
) => {
  const {
    circleProps: { diameter },
    circles,
    colors,
    user,
  } = config.timeline;
  const { circlePositions, expandIconPositions } = app.timeline;
  const p = app.p;
  const up = app.up;

  if (!circles.every(({ visited }) => visited === true)) {
    return;
  }

  let clickedIndex = -1;
  expandIconPositions.forEach((positions) => {
    const { x, y } = getCoordinateValues(positions);
    if (isInsideCircle(app.mouseX, app.mouseY, x, y + diameter / 2, 20)) {
      clickedIndex = positions.index;
    }
  });

  if (clickedIndex === -1) {
    return;
  }

  if (app.nodeIndexRevisited !== clickedIndex) {
    app.nodeIndexRevisited = clickedIndex;
  } else {
    flow.clearBelowTimelineCircles();
    clickedIndex = -1;
    app.nodeIndexRevisited = -1;
    wipeAndRecreateUserCanvas();

    circles.forEach((__, index) => {
      if (!p || !up) {
        return;
      }
      p.push();
      p.stroke(colors.visitedBlue);
      const position = circlePositions[index];
      const { x, y } = getCoordinateValues(position);
      up.image(
        p.completedCheckMark,
        x - user.width / 2,
        y - user.height / 2,
        user.width,
        user.height
      );
      p.pop();
    });
    drawOpenArrowWithoutAnimationIcon();
    return;
  }

  flow.clearBelowTimelineCircles();

  if (circles[clickedIndex].type === 'advertiser') {
    // @ts-ignore
    app.joinInterestGroup.joinings[clickedIndex][0].props.y1 += 20;
  } else {
    // @ts-ignore
    app.auction.auctions[clickedIndex][0].props.y1 += 20;
  }

  app.isRevisitingNodeInInteractiveMode = true;
  app.drawFlows(clickedIndex);

  app.promiseQueue?.push((cb) => {
    app.shouldRespondToClick = true;
    renderUserIcon();

    app.isRevisitingNodeInInteractiveMode = false;

    if (circles[clickedIndex].type === 'advertiser') {
      // @ts-ignore
      app.joinInterestGroup.joinings[clickedIndex][0].props.y1 -= 20;
    } else {
      // @ts-ignore
      app.auction.auctions[clickedIndex][0].props.y1 -= 20;
    }

    cb?.(undefined, true);
  });

  wipeAndRecreateUserCanvas();

  circles.forEach((__, index) => {
    if (!p || !up) {
      return;
    }
    p.push();
    p.stroke(colors.visitedBlue);
    const position = circlePositions[index];
    const { x, y } = getCoordinateValues(position);
    up.image(
      p.completedCheckMark,
      x - user.width / 2,
      y - user.height / 2,
      user.width,
      user.height
    );
    p.pop();
  });
  drawOpenArrowWithoutAnimationIcon();
  try {
    app.promiseQueue?.start();
  } catch (error) {
    // Fail silently
  }
};

export default mouseClickedInNonInteractiveModeCallback;

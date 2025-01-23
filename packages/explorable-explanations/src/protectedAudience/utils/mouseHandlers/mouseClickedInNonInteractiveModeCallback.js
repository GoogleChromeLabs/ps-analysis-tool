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
import { isInsideCircle } from '../isInsideCircle';

//Need to pass this from the caller to avoid circular dependencies
const mouseClickedInNonInteractiveModeCallback = (renderUserIcon) => {
  const {
    circleProps: { diameter },
    circles,
  } = config.timeline;

  if (!circles.every(({ visited }) => visited === true)) {
    return;
  }

  let clickedIndex = -1;
  app.timeline.expandIconPositions.forEach((positions) => {
    if (
      isInsideCircle(
        app.mouseX,
        app.mouseY,
        positions.x,
        positions.y + diameter / 2,
        20
      )
    ) {
      clickedIndex = positions.index;
    }
  });

  if (clickedIndex === -1) {
    return;
  }

  flow.clearBelowTimelineCircles();

  if (circles[clickedIndex].type === 'advertiser') {
    app.joinInterestGroup.joinings[clickedIndex][0].props.y1 += 20;
  } else {
    app.auction.auctions[clickedIndex][0].props.y1 += 20;
  }

  app.isRevisitingNodeInInteractiveMode = true;
  app.drawFlows(clickedIndex);

  app.promiseQueue.push((cb) => {
    app.shouldRespondToClick = true;
    renderUserIcon();

    app.timeline.expandIconPositions.forEach((position, index) => {
      app.p.push();
      if (index === clickedIndex) {
        app.p.rotate(app.p.TWO_PI / 2);
        app.p.image(
          app.p.openWithoutAnimation,
          -position.x - 10,
          -position.y - 20,
          20,
          20
        );
      } else {
        app.p.image(
          app.p.openWithoutAnimation,
          position.x - 10,
          position.y,
          20,
          20
        );
      }
      app.p.pop();
    });

    app.isRevisitingNodeInInteractiveMode = false;

    if (circles[clickedIndex].type === 'advertiser') {
      app.joinInterestGroup.joinings[clickedIndex][0].props.y1 -= 20;
    } else {
      app.auction.auctions[clickedIndex][0].props.y1 -= 20;
    }

    cb(null, true);
  });

  app.promiseQueue.start();
};

export default mouseClickedInNonInteractiveModeCallback;

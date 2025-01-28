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
import app from '../app';
import config, { publisherData } from '../config';
import { isInsideCircle, scrollToCoordinates } from '../utils';

const FlowExpander = async ({ nextTipCoordinates, typeOfBranches }) => {
  const p = app.p;
  const igp = app.igp;
  const iconSize = config.timeline.expandIconSize;
  const iconRadius = iconSize / 2;
  const currentSite =
    config.timeline.circles[app.timeline.currentIndex].website;

  igp.mouseMoved = ({ offsetX, offsetY }) => {
    let hoveringOverSomething = false;
    nextTipCoordinates.forEach(({ x, y }) => {
      if (isInsideCircle(offsetX, offsetY, x, y + 27, iconRadius)) {
        hoveringOverSomething = true;
      }
    });
    if (hoveringOverSomething) {
      p.cursor('pointer');
    } else {
      p.cursor('default');
    }
  };

  const endpoint = await new Promise((resolve) => {
    igp.mouseClicked = ({ offsetX, offsetY }) => {
      nextTipCoordinates.forEach(({ x, y }, index) => {
        if (isInsideCircle(offsetX, offsetY, x, y + 27, iconRadius)) {
          igp.mouseClicked(false);
          igp.mouseMoved(false);
          if (typeOfBranches === 'datetime') {
            app.setSelectedDateTime(
              `${publisherData[currentSite].branches[index].date} ${publisherData[currentSite].branches[index].time}`
            );
          } else {
            app.setSelectedAdUnit(publisherData[currentSite].adunits[1]);
          }
          resolve({ x, y });
          return;
        }
      });
    };
  });

  nextTipCoordinates.forEach(({ x, y }) => {
    p.push();
    p.noStroke();
    p.circle(x, y + 27, 25);
    p.pop();

    if (endpoint.x !== x) {
      p.push();
      p.tint(255, 90);
      p.image(p.expandIcon, x - iconRadius, y + 17, iconSize, iconSize);
      p.pop();
    } else {
      p.push();
      p.rotate(p.TWO_PI / 2, [1, 1, 0]);
      p.image(p.expandIcon, -x - iconRadius, -y - 35, iconSize, iconSize);
      p.pop();
    }
  });
  scrollToCoordinates(endpoint.x, endpoint.y);

  return endpoint;
};

export default FlowExpander;

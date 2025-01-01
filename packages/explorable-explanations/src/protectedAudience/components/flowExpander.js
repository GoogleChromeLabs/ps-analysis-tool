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
import config from '../config';
import { isInsideCircle } from '../utils';

const FlowExpander = async ({ nextTipCoordinates }) => {
  const p = app.p;
  const iconSize = config.timeline.expandIconSize;
  const iconRadius = iconSize / 2;

  p.mouseMoved = ({ offsetX, offsetY }) => {
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
    p.mouseClicked = ({ offsetX, offsetY }) => {
      nextTipCoordinates.forEach(({ x, y }) => {
        if (isInsideCircle(offsetX, offsetY, x, y + 27, iconRadius)) {
          p.mouseClicked(false);
          p.mouseMoved(false);
          resolve({ x, y });
          return;
        }
      });
    };
  });

  nextTipCoordinates.forEach(({ x, y }) => {
    if (endpoint.x !== x) {
      p.push();
      p.noStroke();
      p.circle(x, y + 27, 25);
      p.pop();

      p.push();
      p.tint(255, 90);
      p.image(p.expandIcon, x - iconRadius, y + 17, iconSize, iconSize);
      p.pop();
    }
  });

  return endpoint;
};

export default FlowExpander;
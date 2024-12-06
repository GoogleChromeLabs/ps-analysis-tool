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
 * Internal Dependencies
 */
import config from '../config.js';
import app from '../app.js';
import { calculateCanvasDimensions } from '../utils';

export const setupInterestGroupCanvas = (p) => {
  const { height, width } = calculateCanvasDimensions();
  const overlayCanvas = p.createCanvas(width, height);

  overlayCanvas.parent('interest-canvas');
  overlayCanvas.style('z-index', 2);
  p.textSize(config.canvas.fontSize);
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.bubbles.minifiedBubbleX = 35;
    app.bubbles.minifiedBubbleY = 35;

    app.bubbles.expandedBubbleX = config.canvas.width / 4 + 320;
    app.bubbles.expandedBubbleY = 0;

    // 335 is the angle where the close icon should be visible.
    const angle = (305 * Math.PI) / 180;
    // 335 is the radius + the size of icon so that icon is attached to the circle.
    const x = 335 * Math.cos(angle) + app.bubbles.expandedBubbleX;
    const y = 335 * Math.sin(angle) + 320;

    app.closeButton.style.left = `${x}px`;
    app.closeButton.style.top = `${y}px`;

    document.styleSheets[0].cssRules.forEach((rules, index) => {
      if (rules.selectorText === '.minified-bubble-container.expanded') {
        document.styleSheets[0].cssRules[index].style.left = `${
          app.bubbles.expandedBubbleX - 320
        }px`;

        document.styleSheets[0].cssRules[
          index
        ].style.width = `${app.bubbles.expandedCircleDiameter}px`;
        document.styleSheets[0].cssRules[
          index
        ].style.height = `${app.bubbles.expandedCircleDiameter}px`;
      }

      if (rules.selectorText === '.minified-bubble-container') {
        document.styleSheets[0].cssRules[index].style.top = `${
          app.bubbles.minifiedBubbleY - 25
        }px`;
      }
    });
  }

  app.igp = p;
};

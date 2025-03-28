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
import config from '../config';
import app from '../app';
import { calculateCanvasDimensions } from '../utils';
import type { P5 } from '../types';
import increasePixelDensityConditionally from '../utils/increasePixelDensityConditionally';

export const setupInterestGroupCanvas = (p: P5) => {
  try {
    const { height, width } = calculateCanvasDimensions();
    const overlayCanvas = p.createCanvas(width, height);

    increasePixelDensityConditionally(p);
    overlayCanvas.parent('interest-canvas');
    overlayCanvas.style('z-index', '2');
    p.textSize(config.canvas.fontSize);
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

      if (app.closeButton) {
        app.closeButton.style.left = `${x}px`;
        app.closeButton.style.top = `${y}px`;
      }

      Array.from(document.styleSheets[0].cssRules).forEach((rules, index) => {
        const styleRule = rules as CSSStyleRule;
        const documentStyleRule = (
          document.styleSheets[0].cssRules[index] as CSSStyleRule
        ).style;

        if (styleRule.selectorText === '.minified-bubble-container.expanded') {
          documentStyleRule.left = `${app.bubbles.expandedBubbleX - 320}px`;

          documentStyleRule.width = `${app.bubbles.expandedCircleDiameter}px`;
          documentStyleRule.height = `${app.bubbles.expandedCircleDiameter}px`;
        }

        if (styleRule.selectorText === '.minified-bubble-container') {
          documentStyleRule.top = `${app.bubbles.minifiedBubbleY - 25}px`;
        }
      });
    }

    app.igp = p;
  } catch (error) {
    // eslint-disable-next-line no-console -- We should know the error and let it fail silently since it doesnt break anything.
    console.log(error);
  }
};

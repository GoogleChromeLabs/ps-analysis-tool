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

/**
 * External dependencies.
 */
import throttle from 'just-throttle';

export const setupMainCanvas = async (p, doNotPlay = false) => {
  const { height, width } = calculateCanvasDimensions();
  const canvas = p.createCanvas(width, height);

  p.smooth();
  canvas.parent('ps-canvas');
  canvas.style('z-index', 0);
  p.background(config.canvas.background);
  p.textSize(config.canvas.fontSize);
  app.p = p;

  canvas.mouseOut(() => {
    if (app.isInteractiveMode) {
      app.startTrackingMouse = false;
    }
  });

  canvas.mouseOver(() => {
    if (app.isInteractiveMode) {
      app.startTrackingMouse = true;
    }
  });

  const mouseMovedCallback = throttle(() => {
    const callbacks = app.canvasEventListerners.main.mouseMoved;

    Object.keys(callbacks).forEach((key) => {
      const callback = callbacks[key];

      if (typeof callback === 'function') {
        callback(p.mouseX, p.mouseY);
      }
    });
  }, 500);

  canvas.mouseMoved(mouseMovedCallback);

  app.setUpTimeLine();

  if (!app.isInteractiveMode) {
    await app.play(false, doNotPlay);
  }
};

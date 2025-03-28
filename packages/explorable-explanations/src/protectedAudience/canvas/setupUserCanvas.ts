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

export const setupUserCanvas = (p: P5) => {
  try {
    const { height, width } = calculateCanvasDimensions();
    const overlayCanvas = p.createCanvas(width, height);
    increasePixelDensityConditionally(p);
    overlayCanvas.parent('user-canvas');
    overlayCanvas.style('z-index', '1');
    p.textSize(config.canvas.fontSize);
    app.up = p;
  } catch (error) {
    // eslint-disable-next-line no-console -- We should know the error and let it fail silently since it doesnt break anything.
    console.log(error);
  }
};

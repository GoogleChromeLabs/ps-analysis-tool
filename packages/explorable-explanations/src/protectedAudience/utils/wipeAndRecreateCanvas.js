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
 * Internal dependecies.
 */
import app from '../app';
import config from '../config';
import { calculateCanvasDimensions } from './calculateCanvasDimensions';

export const wipeAndRecreateMainCanvas = () => {
  app.p.clear();
  app.p.background(config.canvas.background);

  app.timeline.drawTimelineLine();
  app.timeline.drawTimeline(config.timeline);
};

export const wipeAndRecreateInterestCanvas = () => {
  const { height, width } = calculateCanvasDimensions();
  const overlayCanvas = app.igp.createCanvas(width, height);

  overlayCanvas.parent('interest-canvas');
  overlayCanvas.style('z-index', 2);
};

export const wipeAndRecreateUserCanvas = () => {
  const { height, width } = calculateCanvasDimensions();
  const canvas = app.up.createCanvas(width, height);

  canvas.parent('user-canvas');
  canvas.style('z-index', 1);
  canvas.id('user-canvas');
};

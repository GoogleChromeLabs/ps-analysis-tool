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
 * Internal dependencies.
 */
import app from '../app';
import config from '../config.js';

/**
 * @module Flow
 * Handles animations, coordinate calculations, and visual effects for the timeline and interest groups.
 */
const flow = {};

/**
 * Gets the coordinates of a timeline circle based on its index.
 * @param {number} index - The index of the circle in the timeline.
 * @returns {object} An object containing `x` and `y` coordinates of the circle.
 */
flow.getTimelineCircleCoordinates = (index) => {
  const { circleProps } = config.timeline;
  const { diameter } = circleProps;

  const positions = app.timeline.circlePositions[index];

  return { x: positions.x, y: positions.y + diameter / 2 };
};

/**
 * Creates a rectangle (override box) to cover a specific area on the canvas.
 * @param {number} x1 - The x-coordinate of the rectangle's starting point.
 * @param {number} y1 - The y-coordinate of the rectangle's starting point.
 * @param {number} x2 - The x-coordinate of the rectangle's ending point.
 * @param {number} height - The height of the rectangle.
 */
flow.createOverrideBox = (x1, y1, x2, height) => {
  const p = app.p;
  const paddingLeft = 1;

  const width = x2 - x1;
  const topY = y1;

  p.push();
  p.noStroke(); // No border
  p.fill(config.canvas.background); // Fill color from config
  p.rect(x1 + paddingLeft, topY, width, height); // Draw the rectangle
  p.pop();
};

/**
 * Clears all visuals below the timeline circles.
 * Useful for resetting the canvas or clearing unwanted elements.
 */
flow.clearBelowTimelineCircles = () => {
  const { y } = flow.getTimelineCircleCoordinates(0);
  const p = app.p;

  p.push();
  p.noStroke();
  p.fill(config.canvas.background);
  p.rect(0, y, p.width, p.height - y);
  p.pop();
};

export default flow;
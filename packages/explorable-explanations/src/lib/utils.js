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

// @todo To be broken down into multipe functions.
const utils = {};

utils.requestInterval = (fn, delay) => {
  let start = performance.now();
  const handle = { id: null };

  /**
   *
   */
  function loop() {
    const current = performance.now();
    const elapsed = current - start;

    if (elapsed >= delay) {
      fn(); // Execute the callback function
      start = performance.now(); // Reset start time
    }

    handle.id = requestAnimationFrame(loop); // Continue the loop
  }

  handle.id = requestAnimationFrame(loop); // Start the loop
  return handle;
};

utils.clearRequestInterval = (handle) => {
  cancelAnimationFrame(handle.id);
};

utils.drawArrow = (size, x, y, direction = 'right') => {
  let _x, _y;

  if (direction === 'right') {
    _x = x - 1;
    _y = y;
  } else if (direction === 'left') {
    _x = x + 1;
    _y = y;
  } else if (direction === 'down') {
    _x = x;
    _y = y - 1;
  } else if (direction === 'up') {
    _x = x;
    _y = y + 1;
  }

  // Clear previous one.
  utils.triangle(size + 2, _x, _y, direction, config.canvas.background);

  utils.triangle(size, x, y, direction, 'black');
};

utils.triangle = (size, x, y, direction = 'right', color = 'black') => {
  const p = app.p;
  const height = (p.sqrt(3) / 2) * size; // Height of an equilateral triangle
  let angle;

  // Determine the angle of rotation based on the direction
  if (direction === 'right') {
    angle = p.radians(90); // Pointing right (default)
  } else if (direction === 'down') {
    angle = p.radians(180); // Pointing down
  } else if (direction === 'left') {
    angle = p.radians(270); // Pointing down
  } else if (direction === 'up') {
    angle = p.radians(360); // Pointing down
  }

  // Coordinates of the triangle's vertices
  const spacing = 6;
  const x1 = 0;
  const y1 = -height / 2; // Top vertex
  const x2 = -size / 2;
  const y2 = height / 2; // Bottom-left vertex
  const x3 = size / 2;
  const y3 = height / 2; // Bottom-right vertex

  // Save the current state of the canvas
  p.push();

  // Move the origin to the triangle's center
  if (direction === 'right') {
    p.translate(x + spacing, y);
  } else if (direction === 'left') {
    p.translate(x - spacing, y + spacing);
  } else if (direction === 'down') {
    p.translate(x, y + spacing);
  } else {
    p.translate(x, y - spacing);
  }

  // Rotate the triangle based on the angle
  p.rotate(angle);
  p.noStroke();

  p.fill(color);

  // Draw the triangle using the calculated vertices
  p.triangle(x1, y1, x2, y2, x3, y3);

  // Restore the previous state of the canvas
  p.pop();
};

utils.delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
utils.wipeAndRecreateInterestCanvas = () => {
  const { height, width } = app.calculateCanvasDimensions();
  const overlayCanvas = app.igp.createCanvas(width, height);

  overlayCanvas.parent('interest-canvas');
  overlayCanvas.style('z-index', 2);
};

utils.wipeAndRecreateMainCanvas = () => {
  const { height, width } = app.calculateCanvasDimensions();
  const canvas = app.p.createCanvas(width, height);
  canvas.parent('ps-canvas');
  canvas.style('z-index', 0);
  app.p.background(config.canvas.background);
  app.p.textSize(config.canvas.fontSize);
};

utils.wipeAndRecreateUserCanvas = () => {
  const { height, width } = app.calculateCanvasDimensions();
  const canvas = app.up.createCanvas(width, height);

  canvas.parent('user-canvas');
  canvas.style('z-index', 1);
};

utils.isInsideCircle = (x, y, x0, y0, r) => {
  return app.p.dist(x, y, x0, y0) <= r;
};

utils.drawText = (text, x, y) => {
  const p = app.p;

  if (text) {
    p.push();
    p.strokeWeight(0.1);
    p.fill('#000');
    p.textSize(config.canvas.fontSize - 2);
    p.textFont('ui-sans-serif');
    p.text(text, x, y);
    p.pop();
  }
};

export default utils;

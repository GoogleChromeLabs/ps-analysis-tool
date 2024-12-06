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
import config from '../config';

export const drawArrow = (size, x, y, direction = 'right') => {
  // Determine offset based on direction
  const directionOffsets = {
    right: { _x: x - 1, _y: y },
    left: { _x: x + 1, _y: y },
    down: { _x: x, _y: y - 1 },
    up: { _x: x, _y: y + 1 },
  };

  const offset = directionOffsets[direction] || directionOffsets['right'];

  // Clear the previous arrow
  triangle(size + 2, offset._x, offset._y, direction, config.canvas.background);

  // Draw the new arrow
  triangle(size, x, y, direction, 'black');
};

export const triangle = (size, x, y, direction = 'right', color = 'black') => {
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

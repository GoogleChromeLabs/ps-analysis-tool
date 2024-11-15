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
 * External dependencies.
 */
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import utils from '../lib/utils';
import app from '../app.js';
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
 * Animates interest group bubbles from their initial positions to their targets.
 * @param {number} index - The index of the timeline circle where the animation begins.
 * @returns {Promise<void>} Resolves once all bubbles reach their targets.
 */
flow.barrageAnimation = async (index) => {
  const p = app.igp;
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;
  const smallCircleRadius = smallCircleDiameter / 2;
  const mainCircleRadius = config.timeline.user.width / 2;
  const accomodatingCircles = Math.round(
    (2 * Math.PI * mainCircleRadius) / (2 * smallCircleRadius)
  );
  const angleStep = 360 / accomodatingCircles;
  const { bottomFlow } = app.auction.auctions[index];

  const positionsOfCircles = app.timeline.smallCirclePositions.map(
    (data, i) => {
      const randomX =
        position.x +
        (smallCircleRadius + mainCircleRadius) * Math.cos(i * angleStep);
      const randomY =
        position.y +
        (smallCircleRadius + mainCircleRadius) * Math.sin(i * angleStep);

      const speed = 2;
      const width = config.flow.mediumBox.width;
      const height = config.flow.mediumBox.height;

      const target = p.createVector(
        bottomFlow[0]?.box?.x +
          Math.floor(Math.random() * (1 - width / 2 + 1)) +
          width / 2,
        bottomFlow[0]?.box?.y +
          Math.floor(Math.random() * (1 - height / 2 + 1)) +
          height / 2
      );

      const currentColor = p.color(data.color);
      const color = p.color(
        p.red(currentColor),
        p.green(currentColor),
        p.blue(currentColor),
        128
      );

      return { x: randomX, y: randomY, color, speed, target };
    }
  );

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();
      utils.drawPreviousCircles();

      const maxX = bottomFlow[0]?.box?.x + config.flow.mediumBox.width;
      const maxY = bottomFlow[0]?.box?.y + config.flow.mediumBox.height;

      for (let i = 0; i < positionsOfCircles.length; i++) {
        let { x, y } = positionsOfCircles[i];
        const { target, speed, color } = positionsOfCircles[i];
        const dir = p5.Vector.sub(target, p.createVector(x, y));
        dir.normalize();

        if (!(x < maxX && x > target.x && y < maxY && y > target.y)) {
          x += dir.x * speed;
          y += dir.y * speed;
        }

        p.push();
        p.noStroke();
        p.fill(color);
        p.circle(x, y, smallCircleDiameter);
        p.pop();
        positionsOfCircles[i] = { x, y, target, speed, color };
      }

      if (
        positionsOfCircles.every((circle) => {
          return (
            circle.x < maxX &&
            circle.x > circle.target.x &&
            circle.y < maxY &&
            circle.y > circle.target.y
          );
        })
      ) {
        clearInterval(app.flow.intervals['circleMovements']);
        resolve();
      }
    }, 10);
  });

  await utils.delay(500);

  utils.wipeAndRecreateInterestCanvas();
  utils.drawPreviousCircles();
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

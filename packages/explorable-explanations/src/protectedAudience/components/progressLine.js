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
import config from '../config';
import app from '../app';
import * as utils from '../utils';

const ARROW_SIZE = 10;

const ProgressLine = ({
  x1,
  y1,
  direction = 'right',
  text = '',
  noArrow = false,
  noAnimation = true,
}) => {
  const width = config.flow.lineWidth - ARROW_SIZE;
  const height = config.flow.lineHeight - ARROW_SIZE;
  const incrementBy = 5; // Adjust to control speed
  const p = app.p;

  x1 = typeof x1 === 'function' ? x1() : x1;
  y1 = typeof y1 === 'function' ? y1() : y1;

  const { x2, y2 } = getEndpointCoordinates(x1, y1, direction);

  const drawArrow = (x, y, dir) => {
    if (!noArrow) {
      utils.drawArrow(ARROW_SIZE, x, y, dir);
    }
  };

  const draw = {
    right: () => {
      p.line(x1, y1, x1 + width, y2);
      drawArrow(x1 + width, y1, direction);

      return { x: x1 + width, y: y1 };
    },
    left: () => {
      p.line(x2, y2 + 10, x2 - width, y1 + 10);
      drawArrow(x2 - width, y1 + 4, direction);
      utils.drawText(text, x2 - width / 2, y1 + height / 2);

      return { x: x2 - width, y: y1 + 10 };
    },
    down: () => {
      p.line(x1, y1, x2, y1 + height);
      drawArrow(x1, y1 + height, direction);
      utils.drawText(
        text,
        x1 - (text.startsWith('$') ? 10 : width / 2),
        y1 + height / 2
      );

      return { x: x1, y: y1 + height };
    },
    up: () => {
      p.line(x1, y1, x2, y1 - height);
      drawArrow(x1, y1 - height, direction);
      utils.drawText(
        text,
        x1 + (text.startsWith('$') ? 10 : width / 2),
        y1 - height / 2
      );

      return { x: x1, y: y1 - height };
    },
  };

  let returnCoordinates = { x: 0, y: 0 };

  const drawInstantly = () => {
    p.push();
    p.stroke(0);
    p.strokeWeight(1);

    returnCoordinates = draw[direction]();

    p.pop();
  };

  let currentX = x1; // For horizontal directions
  let currentY = y1; // For vertical directions
  let targetX = x2;

  return new Promise((resolve) => {
    const animate = () => {
      if (app.cancelPromise) {
        resolve();
        return;
      }

      if (app.timeline.isPaused) {
        requestAnimationFrame(animate); // Keep the animation loop alive but paused
        return;
      }

      if (noAnimation || app.isRevisitingNodeInInteractiveMode) {
        drawInstantly();
        resolve(returnCoordinates);
        return;
      }

      p.push();
      p.stroke(0);
      p.strokeWeight(1);

      switch (direction) {
        case 'right':
          currentX += incrementBy;

          if (currentX - x1 > width) {
            resolve({ x: currentX, y: y2 });
            return;
          }
          p.line(x1, y1, currentX, y2);
          drawArrow(currentX, y1, direction);
          break;

        case 'left':
          targetX -= incrementBy;

          if (x2 - targetX > width) {
            utils.drawText(text, targetX + width / 2, y1 + height / 2);
            resolve({ x: targetX, y: y1 + 10 });
            return;
          }
          p.line(x2, y2 + 10, targetX, y1 + 10);
          drawArrow(targetX, y1 + 4, direction);
          break;

        case 'down':
          currentY += incrementBy;

          if (currentY - y1 > height) {
            utils.drawText(
              text,
              x1 - (text.startsWith('$') ? 10 : width / 2),
              y1 + height / 2
            );
            resolve({ x: x2, y: currentY });
            return;
          }
          p.line(x1, y1, x2, currentY);
          drawArrow(x1, currentY, direction);
          break;

        case 'up':
          currentY -= incrementBy;

          if (y1 - currentY > height) {
            utils.drawText(
              text,
              x1 + (text.startsWith('$') ? 10 : width / 2),
              y1 - height / 2
            );
            resolve({ x: x2, y: currentY });
            return;
          }
          p.line(x1, y1, x2, currentY);
          drawArrow(x1, currentY, direction);
          break;

        default:
          throw new Error(`Invalid direction: ${direction}`);
      }

      p.pop();

      if (app.cancelPromise) {
        resolve();
        return;
      }
      // Continue the animation loop
      requestAnimationFrame(animate);
    };

    // Start the animation loop
    requestAnimationFrame(animate);
  });
};

/**
 * Calculates the endpoint coordinates based on the given direction.
 * @param {number} x1 - The starting x-coordinate.
 * @param {number} y1 - The starting y-coordinate.
 * @param {string} direction - The direction of the line ('down', 'right', 'left', 'up').
 * @returns {{x2: number, y2: number}} The endpoint coordinates.
 */
const getEndpointCoordinates = (x1, y1, direction) => {
  const { lineHeight, lineWidth } = config.flow;
  let x2 = x1;
  let y2 = y1;

  switch (direction) {
    case 'down':
      y2 += lineHeight;
      break;
    case 'right':
      x2 += lineWidth;
      break;
    case 'left':
      x2 -= lineWidth;
      x2 = x2 < lineWidth ? lineWidth : x2;
      break;
    case 'up':
      y2 -= lineHeight;
      break;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  return { x2, y2 };
};

export default ProgressLine;

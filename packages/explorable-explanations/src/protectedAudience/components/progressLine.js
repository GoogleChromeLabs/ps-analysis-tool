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
  customWidth,
  customHeight,
  direction = 'right',
  text = '',
  noArrow = false,
  noAnimation = app.speedMultiplier === 4,
  isBranch = false,
  isForBranches = false,
}) => {
  const width = customWidth ?? config.flow.lineWidth - ARROW_SIZE;
  const height = customHeight ?? config.flow.lineHeight - ARROW_SIZE;
  const incrementBy = isBranch ? 15 : app.speedMultiplier; // Adjust to control speed
  const p = app.p;
  const scrollAdjuster =
    (direction === 'right' ? config.flow.box.height : config.flow.box.width) /
    2;

  x1 = typeof x1 === 'function' ? x1() : x1;
  y1 = typeof y1 === 'function' ? y1() : y1;

  const { x2, y2 } = getEndpointCoordinates(x1, y1, direction, width, height);

  const drawArrow = (x, y, dir) => {
    if (!noArrow) {
      utils.drawArrow(ARROW_SIZE, x, y, dir);
    }
  };

  const getRectSize = () => {
    if (noArrow) {
      return 0;
    }

    return 10;
  };

  let currentX = x1; // For horizontal directions
  let currentY = y1; // For vertical directions

  return new Promise((resolve) => {
    // eslint-disable-next-line complexity
    const animate = () => {
      if (app.cancelPromise) {
        resolve();
        return;
      }

      if (app.timeline.isPaused) {
        requestAnimationFrame(animate); // Keep the animation loop alive but paused
        return;
      }

      //Redundant condition to handle case when animation has started and someone has switched to fastest speed.
      let drawInstantlyFlag = false;

      if (
        noAnimation ||
        app.isRevisitingNodeInInteractiveMode ||
        app.speedMultiplier === 4
      ) {
        drawInstantlyFlag = true;
      }

      const size = getRectSize();
      p.push();
      p.stroke(0);
      p.strokeWeight(1);

      switch (direction) {
        case 'right':
          currentX += Math.min(incrementBy, x2 - currentX);
          if (!isForBranches) {
            utils.scrollToCoordinates(currentX + width, y2 - scrollAdjuster);
          }

          if (drawInstantlyFlag) {
            currentX = x2;
          }

          p.push();
          p.noStroke();

          p.rect(x1 + 1, y1 - size / 2, width, size + 1);
          p.pop();

          p.line(x1, y1, currentX, y2);
          drawArrow(currentX, y1, direction);

          if (currentX === x2) {
            resolve({ x: x2, y: y2 });
            return;
          }

          break;

        case 'left':
          currentX -= Math.min(incrementBy, currentX - x2);

          if (!isForBranches) {
            utils.scrollToCoordinates(currentX, y1 - scrollAdjuster);
          }

          if (drawInstantlyFlag) {
            currentX = x2;
          }

          p.push();
          p.noStroke();
          p.rect(x2, y1 - size / 2, width - 1, size + 1);
          p.pop();

          p.line(x1, y1, currentX, y2);
          drawArrow(currentX, y1 - 5, direction);

          if (currentX === x2) {
            utils.drawText(text, currentX + width / 2, y1 + height / 2 - 10);
            resolve({ x: x2, y: y2 });
            return;
          }

          break;

        case 'down':
          currentY += Math.min(incrementBy, y2 - currentY);

          if (drawInstantlyFlag) {
            currentY = y2;
          }

          p.push();
          p.noStroke();
          p.rect(x1 - size / 2, y1 + 1, size + 1, height);
          p.pop();

          p.line(x1, y1, x2, currentY);
          drawArrow(x1, currentY - 2, direction);

          if (currentY === y2) {
            utils.drawText(
              text,
              x1 - (text.startsWith('$') ? 10 : width / 2),
              y1 + height / 2
            );
            resolve({ x: x2, y: currentY });
            return;
          }

          break;

        case 'up':
          currentY -= Math.min(incrementBy, currentY - y2);
          if (!isForBranches) {
            utils.scrollToCoordinates(x1 - scrollAdjuster, y1 - height);
          }

          if (drawInstantlyFlag) {
            currentY = y2;
          }

          p.push();
          p.noStroke();
          p.rect(x1 - size / 2, y2, size + 1, height - 1);
          p.pop();

          p.line(x1, y1, x2, currentY + 2);
          drawArrow(x1, currentY + 2, direction);

          if (currentY === y2) {
            utils.drawText(
              text,
              x1 + (text.startsWith('$') ? 10 : width / 2),
              y1 - height / 2
            );
            resolve({ x: x2, y: currentY });
            return;
          }

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
 * @param width - The width of the line.
 * @param height - The height of the line.
 * @returns {{x2: number, y2: number}} The endpoint coordinates.
 */
const getEndpointCoordinates = (x1, y1, direction, width, height) => {
  let x2 = x1;
  let y2 = y1;

  switch (direction) {
    case 'down':
      y2 += height;
      break;
    case 'right':
      x2 += width;
      break;
    case 'left':
      x2 -= width;
      break;
    case 'up':
      y2 -= height;
      break;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  return { x2, y2 };
};

export default ProgressLine;

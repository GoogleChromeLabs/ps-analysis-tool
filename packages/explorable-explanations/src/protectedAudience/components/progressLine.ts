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
import type { CoordinateValue, Coordinates } from '../types';

const ARROW_SIZE = 10;

type ProgressLineProps = {
  x1: CoordinateValue;
  y1: CoordinateValue;
  customWidth?: number;
  customHeight?: number;
  direction: string;
  text?: string;
  noArrow?: boolean;
  noAnimation?: boolean;
  isForBranches?: boolean;
  forceScroll?: boolean;
};

const ProgressLine = ({
  x1: x1Value,
  y1: y1Value,
  customWidth,
  customHeight,
  direction = 'right',
  text = '',
  noArrow = false,
  noAnimation = app.speedMultiplier === 4,
  isForBranches = false,
  forceScroll = false,
}: ProgressLineProps): Promise<Coordinates | null> => {
  const p = app.p;
  if (!p) {
    return Promise.resolve(null);
  }
  const width = customWidth ?? config.flow.lineWidth - ARROW_SIZE;
  const height = customHeight ?? config.flow.lineHeight - ARROW_SIZE;
  const { x: x1, y: y1 } = utils.getCoordinateValues({
    x: x1Value,
    y: y1Value,
  });
  const { x2, y2 } = getEndpointCoordinates(x1, y1, direction, width, height);

  const drawArrow = (x: number, y: number, dir: string) => {
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
        resolve(null);
        return;
      }

      if (app.timeline.isPaused) {
        requestAnimationFrame(animate); // Keep the animation loop alive but paused
        return;
      }

      //Redundant condition to handle case when animation has started and someone has switched to fastest speed.
      let drawInstantlyFlag = false;
      let isEnding = false;

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
          currentX = p.lerp(currentX, Math.round(x2), app.speedMultiplier / 15);
          isEnding = Math.round(currentX) === Math.round(x2);

          if (drawInstantlyFlag || isEnding) {
            currentX = x2;
          }

          p.push();
          p.noStroke();

          p.rect(x1 + 1, y1 - size / 2, width, size + 1);
          p.pop();

          p.line(x1, y1, currentX, y2);
          drawArrow(currentX, y1, direction);

          if (forceScroll) {
            utils.scrollToCoordinates({ x: currentX, y: y2 });
          }

          if (isEnding) {
            if (!isForBranches) {
              utils.scrollToCoordinates({ x: currentX, y: y2 });
            }
            resolve({ x: x2, y: y2 });
            return;
          }

          break;

        case 'left':
          currentX = p.lerp(currentX, Math.round(x2), app.speedMultiplier / 15);
          isEnding = Math.round(currentX) === Math.round(x2);

          if (drawInstantlyFlag || isEnding) {
            currentX = x2;
          }

          p.push();
          p.noStroke();
          p.rect(x2, y1 - size / 2, width - 1, size + 1);
          p.pop();

          p.line(x1, y1, currentX, y2);
          drawArrow(currentX, y1 - 5, direction);

          if (forceScroll) {
            utils.scrollToCoordinates({ x: currentX, y: y2 });
          }

          if (isEnding) {
            if (!isForBranches) {
              utils.scrollToCoordinates({ x: currentX, y: y2 });
            }
            utils.drawText(text, currentX + width / 2, y1 + height / 2 - 10);
            resolve({ x: x2, y: y2 });
            return;
          }

          break;

        case 'down':
          currentY = p.lerp(currentY, Math.round(y2), app.speedMultiplier / 15);
          isEnding = Math.round(currentY) === Math.round(y2);

          if (drawInstantlyFlag || isEnding) {
            currentY = y2;
          }

          p.push();
          p.noStroke();
          p.rect(x1 - size / 2, y1 + 1, size + 1, height);
          p.pop();

          p.line(x1, y1, x2, currentY);
          drawArrow(x1, currentY - 2, direction);
          if (forceScroll) {
            utils.scrollToCoordinates({ x: currentX, y: y2 });
          }

          if (isEnding) {
            if (!isForBranches) {
              utils.scrollToCoordinates({ x: x2, y: currentY });
            }

            const textWidth = p.textWidth(text);

            utils.drawText(
              text,
              x1 - (text.startsWith('$') ? 10 : textWidth / 2 + 2),
              y1 + height / 2 + 4
            );
            resolve({ x: x2, y: currentY });
            return;
          }

          break;

        case 'up':
          currentY = p.lerp(currentY, Math.round(y2), app.speedMultiplier / 15);
          isEnding = Math.round(currentY) === Math.round(y2);

          if (drawInstantlyFlag || isEnding) {
            currentY = y2;
          }

          p.push();
          p.noStroke();
          p.rect(x1 - size / 2, y2, size + 1, height - 1);
          p.pop();

          p.line(x1, y1, x2, currentY);
          drawArrow(x1, currentY, direction);

          if (forceScroll) {
            utils.scrollToCoordinates({ x: x2, y: currentY });
          }

          if (isEnding) {
            if (!isForBranches) {
              utils.scrollToCoordinates({
                x: x2,
                y: currentY,
              });
            }

            const textWidth = p.textWidth(text);

            utils.drawText(
              text,
              x1 + (text.startsWith('$') ? 10 : textWidth / 2),
              y1 - height / 2 - 3
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
        resolve(null);
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
const getEndpointCoordinates = (
  x1: number,
  y1: number,
  direction: string,
  width: number,
  height: number
): { x2: number; y2: number } => {
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

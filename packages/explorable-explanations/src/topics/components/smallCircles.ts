/*
 * Copyright 2025 Google LLC
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
 * External dependencies
 */
import p5 from 'p5';

/**
 * Internal dependencies
 */
import { getAdtechsColors } from '../utils';

type SmallCircles = {
  p: p5;
  position: { x: number; y: number };
  diameter: number;
  distanceFromEdge: number;
  numSmallCircles: number;
  smallCircleDiameter: number;
  adTechs: string[];
  smallCirclePositions?: { x: number; y: number }[];
};

const smallCircles = ({
  p,
  position,
  diameter,
  distanceFromEdge,
  numSmallCircles,
  smallCircleDiameter,
  adTechs,
  smallCirclePositions,
}: SmallCircles) => {
  const positions = smallCirclePositions || [];

  for (let i = 0; i < numSmallCircles; i++) {
    const circlePosition = positions[i];

    if (circlePosition) {
      positions.push(circlePosition);
      continue;
    }

    // generate random position if not provided
    let randomX: number, randomY: number, isOverlapping: boolean;

    do {
      const angle = Math.random() * 2 * Math.PI;

      randomX =
        position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
      randomY =
        position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

      // eslint-disable-next-line no-loop-func
      isOverlapping = positions.some((pos) => {
        const dx = pos.x - randomX;
        const dy = pos.y - randomY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < smallCircleDiameter;
      });

      const circleCircleDistanceX = Math.abs(position.x - randomX);
      const circleCircleDistanceY = Math.abs(position.y - randomY);

      isOverlapping =
        isOverlapping ||
        circleCircleDistanceX <= smallCircleDiameter ||
        circleCircleDistanceY <= smallCircleDiameter;
    } while (isOverlapping);

    positions.push({ x: randomX, y: randomY });
  }

  console.log(adTechs.length, positions.length);

  for (let i = 0; i < positions.length; i++) {
    console.log(adTechs[i]);

    const adTechColor = getAdtechsColors(p)[adTechs[i]] || '#000000';
    p.push();
    p.fill(adTechColor);
    p.circle(positions[i].x, positions[i].y, smallCircleDiameter);
    p.pop();
  }

  return positions;
};

export default smallCircles;

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

export const calculateCanvasDimensions = () => {
  const {
    timeline: {
      circleProps: { verticalSpacing, diameter },
      position: { x: timelineX, y: timelineY },
      circles,
    },
    rippleEffect: { maxRadius, numRipples },
    flow: {
      lineWidth,
      box: { height: boxHeight, width: boxWidth },
      smallBox: { height: smallBoxHeight },
      mediumBox: { width: mediumBoxWidth },
    },
  } = config;

  const circleSpace = verticalSpacing + diameter;
  const rippleRadius = maxRadius * 2 + (numRipples - 1) * 40;
  const maxHeightUsingBoxAndLine = lineWidth * 2 + boxHeight + smallBoxHeight;
  const height =
    timelineY +
    circleSpace +
    Math.max(rippleRadius, maxHeightUsingBoxAndLine) +
    700; // @todo: 700 is a magic number and needs to be calculated based on the content.

  const auctionBoxesWidth = boxWidth + mediumBoxWidth * 2 + lineWidth * 2;
  const interestGroupWidth = boxWidth;
  let maxXposition = timelineX + circleSpace * circles.length;

  circles.forEach((circle, index) => {
    const xPos = timelineX + circleSpace * index;
    maxXposition = Math.max(
      maxXposition,
      xPos +
        (circle.type === 'publisher' ? auctionBoxesWidth : interestGroupWidth)
    );
  });

  config.canvas.width = maxXposition;
  config.canvas.height = height;

  return {
    height,
    width: maxXposition,
  };
};

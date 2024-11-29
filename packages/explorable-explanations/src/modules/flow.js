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

/**
 * Enables and disables the button opacity and cursor pointer.
 */
flow.setButtonsDisabilityState = () => {
  const prevButton = document.getElementById('prevButton') ?? app.prevButton;
  const nextButton = document.getElementById('nextButton') ?? app.nextButton;
  // Exit early if buttons are not found
  if (!prevButton || !nextButton) {
    return;
  }

  const { currentIndex } = app.timeline;
  const { circles } = config.timeline;
  const isInteractiveMode = config.isInteractiveMode;

  // Helper function to set button state
  const setButtonState = (button, isDisabled) => {
    button.disabled = isDisabled;
    button.classList.toggle('disabled:pointer-events-none', isDisabled);
  };

  if (!isInteractiveMode) {
    setButtonState(prevButton, currentIndex <= 0);
    setButtonState(nextButton, currentIndex >= circles.length - 1);
  }

  // Additional state when the currentIndex exceeds the total circles
  if (currentIndex >= circles.length) {
    setButtonState(prevButton, true);
    setButtonState(nextButton, true);
  }
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.prevButton.style.cursor =
      app.timeline.currentIndex > 0 ? 'pointer' : 'default';
    app.prevButton.disabled = app.timeline.currentIndex > 0 ? false : true;
    app.nextButton.disabled =
      app.timeline.currentIndex === config.timeline.circles.length - 1
        ? true
        : false;
    app.nextButton.style.cursor =
      app.timeline.currentIndex >= config.timeline.circles.length - 1
        ? 'default'
        : 'pointer';
  }
};

export default flow;

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
import { Coordinates } from '../types';
import { getCoordinateValues } from '../utils/getCoordinateValues';

type Flow = {
  getTimelineCircleCoordinates: (index: number) => Coordinates;
  createOverrideBox: (
    x1: number,
    y1: number,
    x2: number,
    height: number
  ) => void;
  clearBelowTimelineCircles: () => void;
  setButtonsDisabilityState: (overrideState?: boolean) => void;
};

/**
 * @module Flow
 * Handles animations, coordinate calculations, and visual effects for the timeline and interest groups.
 */
const flow: Flow = {
  /**
   * Gets the coordinates of a timeline circle based on its index.
   * @param {number} index - The index of the circle in the timeline.
   * @returns {object} An object containing `x` and `y` coordinates of the circle.
   */
  getTimelineCircleCoordinates: (index: number): Coordinates => {
    const { circleProps } = config.timeline;
    const { diameter } = circleProps;

    const positions = app.timeline.circlePositions[index];
    const { x, y } = getCoordinateValues({ x: positions.x, y: positions.y });

    return { x: x, y: y + 1.5 + diameter / 2 };
  },

  /**
   * Creates a rectangle (override box) to cover a specific area on the canvas.
   * @param {number} x1 - The x-coordinate of the rectangle's starting point.
   * @param {number} y1 - The y-coordinate of the rectangle's starting point.
   * @param {number} x2 - The x-coordinate of the rectangle's ending point.
   * @param {number} height - The height of the rectangle.
   */
  createOverrideBox: (x1: number, y1: number, x2: number, height: number) => {
    const p = app.p;

    if (!p) {
      return;
    }

    const paddingLeft = 1;
    const width = x2 - x1;
    const topY = y1;

    p.push();
    p.noStroke(); // No border
    p.fill(config.canvas.background); // Fill color from config
    p.rect(x1 + paddingLeft, topY, width, height); // Draw the rectangle
    p.pop();
  },

  /**
   * Clears all visuals below the timeline circles.
   * Useful for resetting the canvas or clearing unwanted elements.
   */
  clearBelowTimelineCircles: () => {
    const { y } = getCoordinateValues(flow.getTimelineCircleCoordinates(0));
    const p = app.p;

    if (!p) {
      return;
    }

    p.push();
    p.noStroke();
    p.fill(config.canvas.background);
    p.rect(0, y - 1, p.width, p.height - y);
    p.pop();
  },

  /**
   * Enables and disables the button opacity and cursor pointer.
   * @param overrideState If passed this state overrides the state of the buttons;
   */
  setButtonsDisabilityState: (overrideState = false) => {
    const prevButton = document.getElementById('prevButton') ?? app.prevButton;
    const nextButton = document.getElementById('nextButton') ?? app.nextButton;
    // Exit early if buttons are not found
    if (!prevButton || !nextButton) {
      return;
    }

    // Helper function to set button state
    const setButtonState = (button, isDisabled) => {
      button.disabled = isDisabled;
      button.classList.toggle('disabled:pointer-events-none', isDisabled);
      // eslint-disable-next-line no-undef
      if (process.env.IS_RUNNING_STANDALONE) {
        button.style.cursor = isDisabled ? 'default' : 'pointer';
      }
    };

    if (overrideState) {
      setButtonState(prevButton, overrideState);
      setButtonState(nextButton, overrideState);
      return;
    }

    const { currentIndex } = app.timeline;
    const { circles } = config.timeline;
    const isInteractiveMode = app.isInteractiveMode;
    const { visitedIndexOrderTracker, visitedIndexOrder } = app;

    if (!isInteractiveMode) {
      setButtonState(prevButton, currentIndex <= 0);
      setButtonState(nextButton, currentIndex >= circles.length - 1);
      return;
    }

    // Additional state when the currentIndex exceeds the total circles
    if (isInteractiveMode) {
      setButtonState(
        prevButton,
        !(visitedIndexOrderTracker > 0 && visitedIndexOrder.length >= 2)
      );
      setButtonState(
        nextButton,
        !(
          visitedIndexOrderTracker + 1 < visitedIndexOrder.length &&
          visitedIndexOrder.length >= 2
        )
      );
    }
  },
};

export default flow;

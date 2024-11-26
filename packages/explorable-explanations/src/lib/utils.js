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
import app from '../app';

// @todo To be broken down into multipe functions.
const utils = {};

/**
 * Creates a request-based interval function similar to `setInterval`,
 * but uses `requestAnimationFrame` for better synchronization with the browser's refresh rate.
 * @param fn {Function} callback - The function to execute at each interval.
 * @param {number} delay - The interval duration in milliseconds.
 * @returns {object} An object with an `id` property for managing the interval.
 */
utils.requestInterval = (fn, delay) => {
  let start = performance.now();
  const handle = { id: null };

  /**
   * Loop function executed on each animation frame.
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
  // Determine offset based on direction
  const directionOffsets = {
    right: { _x: x - 1, _y: y },
    left: { _x: x + 1, _y: y },
    down: { _x: x, _y: y - 1 },
    up: { _x: x, _y: y + 1 },
  };

  const offset = directionOffsets[direction] || directionOffsets['right'];

  // Clear the previous arrow
  utils.triangle(
    size + 2,
    offset._x,
    offset._y,
    direction,
    config.canvas.background
  );

  // Draw the new arrow
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

utils.wipeAndRecreateMainCanvas = () => {
  const { height, width } = utils.calculateCanvasDimensions();
  const canvas = app.p.createCanvas(width, height);
  canvas.parent('ps-canvas');
  canvas.style('z-index', 0);
  canvas.id('p5-canvas');
  app.p.background(config.canvas.background);
  app.p.textSize(config.canvas.fontSize);
};

utils.wipeAndRecreateInterestCanvas = () => {
  const { height, width } = utils.calculateCanvasDimensions();
  const overlayCanvas = app.igp.createCanvas(width, height);

  overlayCanvas.parent('interest-canvas');
  overlayCanvas.style('z-index', 2);
};

utils.wipeAndRecreateUserCanvas = () => {
  const { height, width } = utils.calculateCanvasDimensions();
  const canvas = app.up.createCanvas(width, height);

  canvas.parent('user-canvas');
  canvas.style('z-index', 1);
  canvas.id('user-canvas');
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
    p.textFont('sans-serif');
    p.text(text, x, y);
    p.pop();
  }
};

utils.setupMainCanvas = async (p, doNotPlay = false) => {
  const { height, width } = utils.calculateCanvasDimensions();
  const canvas = p.createCanvas(width, height);
  canvas.parent('ps-canvas');
  canvas.style('z-index', 0);
  p.background(config.canvas.background);
  p.textSize(config.canvas.fontSize);
  app.p = p;

  canvas.mouseOut(() => {
    if (app.isInteractiveMode) {
      app.startTrackingMouse = false;
    }
  });

  canvas.mouseOver(() => {
    if (app.isInteractiveMode) {
      app.startTrackingMouse = true;
    }
  });

  app.setUpTimeLine();

  if (!app.isInteractiveMode) {
    await app.play(false, doNotPlay);
  }
};

utils.setupInterestGroupCanvas = (p) => {
  const { height, width } = utils.calculateCanvasDimensions();
  const overlayCanvas = p.createCanvas(width, height);

  overlayCanvas.parent('interest-canvas');
  overlayCanvas.style('z-index', 2);
  p.textSize(config.canvas.fontSize);
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.bubbles.minifiedBubbleX = 35;
    app.bubbles.minifiedBubbleY = 35;

    app.bubbles.expandedBubbleX = config.canvas.width / 4 + 320;
    app.bubbles.expandedBubbleY = 0;

    // 335 is the angle where the close icon should be visible.
    const angle = (305 * Math.PI) / 180;
    // 335 is the radius + the size of icon so that icon is attached to the circle.
    const x = 335 * Math.cos(angle) + app.bubbles.expandedBubbleX;
    const y = 335 * Math.sin(angle) + 320;

    app.closeButton.style.left = `${x}px`;
    app.closeButton.style.top = `${y}px`;

    document.styleSheets[0].cssRules.forEach((rules, index) => {
      if (rules.selectorText === '.minified-bubble-container.expanded') {
        document.styleSheets[0].cssRules[index].style.left = `${
          app.bubbles.expandedBubbleX - 320
        }px`;

        document.styleSheets[0].cssRules[
          index
        ].style.width = `${app.bubbles.expandedCircleDiameter}px`;
        document.styleSheets[0].cssRules[
          index
        ].style.height = `${app.bubbles.expandedCircleDiameter}px`;
      }

      if (rules.selectorText === '.minified-bubble-container') {
        document.styleSheets[0].cssRules[index].style.top = `${
          app.bubbles.minifiedBubbleY - 25
        }px`;
      }
    });
  }

  app.igp = p;
};

utils.setupUserCanvas = (p) => {
  const { height, width } = utils.calculateCanvasDimensions();
  const overlayCanvas = p.createCanvas(width, height);

  overlayCanvas.parent('user-canvas');
  overlayCanvas.style('z-index', 1);
  p.textSize(config.canvas.fontSize);
  app.up = p;
};

utils.calculateCanvasDimensions = () => {
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

utils.markVisitedValue = (index, value) => {
  config.timeline.circles = config.timeline.circles.map((circle, i) => {
    if (i < index && index >= 0) {
      circle.visited = value;
    }
    return circle;
  });
};

utils.setButtonsDisabilityState = () => {
  if (!config.isInteractiveMode) {
    document.getElementById('prevButton').disabled =
      app.timeline.currentIndex > 0 ? false : true;

    document
      .getElementById('prevButton')
      .classList.toggle(
        'disabled:pointer-events-none',
        app.timeline.currentIndex > 0 ? true : false
      );

    document.getElementById('nextButton').disabled =
      app.timeline.currentIndex === config.timeline.circles.length - 1;
  }
};
export default utils;

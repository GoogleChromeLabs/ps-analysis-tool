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
import app from '../app.js';

// @todo To be broken down into multipe functions.
const utils = {};

utils.requestInterval = (fn, delay) => {
  let start = performance.now();
  const handle = { id: null };

  /**
   *
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
  let _x, _y;

  if (direction === 'right') {
    _x = x - 1;
    _y = y;
  } else if (direction === 'left') {
    _x = x + 1;
    _y = y;
  } else if (direction === 'down') {
    _x = x;
    _y = y - 1;
  } else if (direction === 'up') {
    _x = x;
    _y = y + 1;
  }

  // Clear previous one.
  utils.triangle(size + 2, _x, _y, direction, config.canvas.background);

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
    p.textFont('ui-sans-serif');
    p.text(text, x, y);
    p.pop();
  }
};

utils.setupMainCanvas = (p) => {
  const { height, width } = utils.calculateCanvasDimensions();
  const canvas = p.createCanvas(width, height);
  canvas.parent('ps-canvas');
  canvas.style('z-index', 0);
  p.background(config.canvas.background);
  p.textSize(config.canvas.fontSize);
  (async () => {
    await app.init(p);
  })();
};

utils.setupInterestGroupCanvas = (p) => {
  const { height, width } = utils.calculateCanvasDimensions();
  const overlayCanvas = p.createCanvas(width, height);

  overlayCanvas.parent('interest-canvas');
  overlayCanvas.style('z-index', 2);
  p.textSize(config.canvas.fontSize);

  config.bubbles.minifiedBubbleX = 35;
  config.bubbles.minifiedBubbleY = 35;

  config.bubbles.expandedBubbleX = config.canvas.width / 4 + 320;
  config.bubbles.expandedBubbleY = 0;

  // 335 is the angle where the close icon should be visible.
  const angle = (305 * Math.PI) / 180;
  // 335 is the radius + the size of icon so that icon is attached to the circle.
  const x = 335 * Math.cos(angle) + config.bubbles.expandedBubbleX;
  const y = 335 * Math.sin(angle) + 320;

  app.closeButton.style.left = `${x}px`;
  app.closeButton.style.top = `${y}px`;

  document.styleSheets[0].cssRules.forEach((rules, index) => {
    if (rules.selectorText === '.minified-bubble-container.expanded') {
      document.styleSheets[0].cssRules[index].style.left = `${
        config.bubbles.expandedBubbleX - 320
      }px`;

      document.styleSheets[0].cssRules[
        index
      ].style.width = `${config.bubbles.expandedCircleDiameter}px`;
      document.styleSheets[0].cssRules[
        index
      ].style.height = `${config.bubbles.expandedCircleDiameter}px`;
    }

    if (rules.selectorText === '.minified-bubble-container') {
      document.styleSheets[0].cssRules[index].style.top = `${
        config.bubbles.minifiedBubbleY - 25
      }px`;
    }
  });

  app.interestGroupInit(p);
};

utils.setupUserCanvas = (p) => {
  const { height, width } = utils.calculateCanvasDimensions();
  const overlayCanvas = p.createCanvas(width, height);

  overlayCanvas.parent('user-canvas');
  overlayCanvas.style('z-index', 1);
  p.textSize(config.canvas.fontSize);

  app.userInit(p);
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

utils.isOverControls = (mouseX, mouseY) => {
  const {
    bubbles: { minifiedBubbleX, minifiedBubbleY, minifiedCircleDiameter },
  } = config;
  if (
    utils.isInsideCircle(
      minifiedBubbleX,
      minifiedBubbleY,
      mouseX,
      mouseY,
      minifiedCircleDiameter + 20
    )
  ) {
    return true;
  }

  const controlButton = document
    .getElementById('play-pause-button')
    .getBoundingClientRect();
  const interactiveModeDivStyles = document
    .getElementById('interactive-mode-div')
    .getBoundingClientRect();
  const multiSellerDivStyles = document
    .getElementById('multi-seller-div')
    .getBoundingClientRect();

  if (
    mouseX >= controlButton.left &&
    mouseX <= controlButton.right &&
    mouseY >= controlButton.top &&
    mouseY <= controlButton.bottom
  ) {
    return true;
  }

  if (
    mouseX >= interactiveModeDivStyles.left &&
    mouseX <= multiSellerDivStyles.right &&
    mouseY >= interactiveModeDivStyles.top &&
    mouseY <= multiSellerDivStyles.bottom
  ) {
    return true;
  }

  if (
    mouseX >= multiSellerDivStyles.left &&
    mouseX <= multiSellerDivStyles.right &&
    mouseY >= multiSellerDivStyles.top &&
    mouseY <= multiSellerDivStyles.bottom
  ) {
    return true;
  }

  return false;
};

utils.markVisitedValue = (index, value) => {
  config.timeline.circles = config.timeline.circles.map((circle, i) => {
    if (i < index && index >= 0) {
      circle.visited = value;
    }
    return circle;
  });
};

utils.disableButtons = () => {
  app.prevButton.style.cursor =
    app.timeline.currentIndex > 0 ? 'pointer' : 'default';
  app.prevButton.disabled = app.timeline.currentIndex > 0 ? false : true;
  app.nextButton.disabled =
    app.timeline.currentIndex === config.timeline.circles.length ? true : false;
  app.nextButton.style.cursor =
    app.timeline.currentIndex === config.timeline.circles.length
      ? 'default'
      : 'pointer';
};

export default utils;

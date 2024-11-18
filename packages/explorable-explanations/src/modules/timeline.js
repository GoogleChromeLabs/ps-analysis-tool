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
import utils from '../lib/utils';
import bubbles from './bubbles';

/**
 * @module Timeline
 * Handles the drawing and interaction of the timeline, including circles, lines, and user-related animations.
 */
const timeline = {};

/**
 * Initializes the timeline by setting up publisher indices, event listeners,
 * and drawing the initial timeline and user icon.
 */
timeline.init = () => {
  config.timeline.circles.forEach((circle, index) => {
    if (circle.type === 'publisher') {
      app.timeline.circlePublisherIndices.push(index);
    }
  });

  if (config.isInteractiveMode) {
    bubbles.showMinifiedBubbles();

    app.p.mouseMoved = (event) => {
      const { x, y } = event;

      config.mouseX = x;
      config.mouseY = y;
      utils.wipeAndRecreateUserCanvas();
      timeline.renderUserIcon(x, y);
    };

    app.p.mouseClicked = async () => {
      if (!config.shouldRespondToClick) {
        return;
      }

      const { circlePositions } = app.timeline;
      let clickedIndex;

      circlePositions.forEach((positions, index) => {
        if (
          utils.isInsideCircle(
            config.mouseX,
            config.mouseY,
            positions.x,
            positions.y,
            config.timeline.circleProps.diameter / 2
          )
        ) {
          clickedIndex = index;
        }
      });

      if (clickedIndex !== undefined) {
        config.shouldRespondToClick = false;
        app.timeline.currentIndex = clickedIndex;
        await app.drawFlows(clickedIndex);
        bubbles.clearAndRewriteBubbles();
        bubbles.showMinifiedBubbles();
        config.shouldRespondToClick = true;
      }
    };
  } else {
    app.timeline.drawTimelineLine();
    app.timeline.renderUserIcon();
  }
  app.timeline.drawTimeline(config.timeline);
};

/**
 * Draws a vertical line above a timeline circle.
 * @param {number} index - The index of the circle.
 * @param {boolean} [completed] - Whether the line should be styled as completed.
 */
timeline.drawLineAboveCircle = (index, completed = false) => {
  const { position, colors } = config.timeline;
  const { diameter } = config.timeline.circleProps;
  const p = app.p;
  const positions = app.timeline.circlePositions[index];
  const strokeColor = completed ? colors.visitedBlue : colors.grey;

  p.push();
  p.stroke(strokeColor);
  p.line(positions.x, positions.y - diameter / 2, positions.x, position.y + 37);
  p.pop();
};

timeline.drawTimeline = ({ position, circleProps, circles }) => {
  const { diameter, verticalSpacing } = circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;
  const p = app.p;

  p.textAlign(p.CENTER, p.CENTER);
  // Draw circles and text at the timeline position
  circles.forEach((circleItem, index) => {
    const xPositionForCircle =
      config.timeline.position.x + diameter / 2 + circleVerticalSpace * index;
    const yPositionForCircle = position.y + circleVerticalSpace;

    app.timeline.circlePositions.push({
      x: xPositionForCircle,
      y: yPositionForCircle,
    });

    p.push();
    p.stroke(config.timeline.colors.grey);
    timeline.drawCircle(index);
    p.pop();

    p.push();
    p.fill(config.timeline.colors.black);
    p.textSize(12);
    p.strokeWeight(0.1);
    p.textFont('ui-sans-serif');
    p.text(circleItem.datetime, xPositionForCircle, position.y);
    p.text(circleItem.website, xPositionForCircle, position.y + 20);
    p.pop();

    timeline.drawLineAboveCircle(index);
  });
};

/**
 * Draws the horizontal timeline line.
 */
timeline.drawTimelineLine = () => {
  const { position, colors, circleProps } = config.timeline;
  const { diameter, verticalSpacing } = circleProps;

  const circleVerticalSpace = verticalSpacing + diameter;
  const yPositonForLine = position.y + circleVerticalSpace;
  const p = app.p;
  let x = 0;

  if (app.timeline.currentIndex === 0) {
    p.push();
    p.stroke(colors.grey);
    p.line(
      0,
      yPositonForLine,
      config.timeline.position.x +
        circleVerticalSpace * (config.timeline.circles.length - 1),
      yPositonForLine
    );
    p.pop();
    return;
  }

  while (
    x <=
      circleVerticalSpace * (app.timeline.currentIndex - 1) +
        config.timeline.position.x &&
    app.timeline.currentIndex < config.timeline.circles.length
  ) {
    p.push();
    p.stroke(26, 115, 232);
    p.line(0, yPositonForLine, x, yPositonForLine);
    p.pop();
    x = x + 1;
  }
};

timeline.drawCircle = (index, completed = false) => {
  const { circleProps, user } = config.timeline;
  const position = app.timeline.circlePositions[index];
  const { diameter } = circleProps;

  app.p.circle(position.x, position.y, diameter);

  if (completed) {
    app.up.image(
      app.p.completedCheckMark,
      position.x - user.width / 2,
      position.y - user.height / 2,
      user.width,
      user.height
    );
  }
};

timeline.renderUserIcon = () => {
  const { mouseX, mouseY } = config;
  const circlePosition = config.isInteractiveMode
    ? { x: mouseX, y: mouseY }
    : app.timeline.circlePositions[app.timeline.currentIndex];

  if (circlePosition === undefined) {
    return;
  }

  const user = config.timeline.user;
  if (!config.isInteractiveMode) {
    timeline.eraseAndRedraw();
  }
  utils.wipeAndRecreateInterestCanvas();

  app.up.image(
    app.p.userIcon,
    circlePosition.x - user.width / 2,
    circlePosition.y - user.height / 2,
    user.width,
    user.height
  );
};

timeline.eraseAndRedraw = () => {
  if (config.isInteractiveMode) {
    return;
  }

  const currentIndex = app.timeline.currentIndex;
  const { colors } = config.timeline;
  utils.wipeAndRecreateUserCanvas();

  if (currentIndex > 0) {
    timeline.drawTimelineLine();
    let i = 0;
    while (i < currentIndex) {
      app.p.push();
      app.p.stroke(colors.visitedBlue);
      timeline.drawCircle(i, true);
      app.p.pop();

      timeline.drawLineAboveCircle(i, true);
      i = i + 1;
    }
  }
};

export default timeline;

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
import config, { Config } from '../config';
import app from '../app';
import {
  wipeAndRecreateInterestCanvas,
  wipeAndRecreateUserCanvas,
} from '../utils';
import bubbles from './bubbles';
import {
  mouseClickedInInteractiveModeCallback,
  mouseClickedInNonInteractiveModeCallback,
  mouseMovedInInteractiveMode,
  mouseMovedInNonInteractiveMode,
} from '../utils/mouseHandlers';

type Timeline = {
  init: () => void;
  drawLineAboveCircle: (index: number, completed?: boolean) => void;
  drawTimeline: (timeline: Config['timeline']) => void;
  drawTimelineLine: () => void;
  drawCircle: (index: number, completed?: boolean) => void;
  renderUserIcon: () => void;
  eraseAndRedraw: () => void;
};

/**
 * @module Timeline
 * Handles the drawing and interaction of the timeline, including circles, lines, and user-related animations.
 */
const timeline: Timeline = {
  /**
   * Initializes the timeline by setting up publisher indices, event listeners,
   * and drawing the initial timeline and user icon.
   */
  init: () => {
    app.timeline.circlePublisherIndices = [];
    config.timeline.circles.forEach((circle, index) => {
      if (circle.type === 'publisher') {
        app.timeline.circlePublisherIndices.push(index);
      }
    });

    if (!app.p) {
      return;
    }

    app.p.mouseMoved = (event) => {
      if (app.isInteractiveMode) {
        mouseMovedInInteractiveMode(event, timeline.renderUserIcon);
      } else {
        mouseMovedInNonInteractiveMode(event);
      }
    };

    app.p.mouseClicked = () => {
      if (app.isInteractiveMode) {
        mouseClickedInInteractiveModeCallback(
          timeline.drawCircle,
          timeline.renderUserIcon
        );
      } else {
        mouseClickedInNonInteractiveModeCallback(timeline.renderUserIcon);
      }
    };

    if (app.isInteractiveMode) {
      bubbles.showMinifiedBubbles?.();
    } else {
      timeline.drawTimelineLine?.();
      timeline.renderUserIcon?.();
    }
    timeline.drawTimeline?.(config.timeline);
  },

  /**
   * Draws a vertical line above a timeline circle.
   * @param {number} index - The index of the circle.
   * @param {boolean} [completed] - Whether the line should be styled as completed.
   */
  drawLineAboveCircle: (index: number, completed = false) => {
    const p = app.p;

    if (!p) {
      return;
    }

    const { position, colors } = config.timeline;
    const { diameter } = config.timeline.circleProps;
    const positions = app.timeline.circlePositions[index];
    const strokeColor =
      completed && !app.isInteractiveMode ? colors.visitedBlue : colors.grey;

    p.push();
    p.stroke(strokeColor);
    p.line(
      positions.x,
      positions.y - diameter / 2,
      positions.x,
      position.y + 37
    );
    p.pop();
  },

  // eslint-disable-next-line jsdoc/require-param
  /**
   * Draws the horizontal timeline line.
   */
  drawTimeline: ({ position, circleProps, circles }) => {
    const p = app.p;

    if (!p) {
      return;
    }

    const { diameter, verticalSpacing } = circleProps;
    const circleVerticalSpace = verticalSpacing + diameter;

    p.textAlign(p.CENTER, p.CENTER);
    // Draw circles and text at the timeline position
    circles.forEach((circleItem, index) => {
      const xPositionForCircle =
        config.timeline.position.x + diameter / 2 + circleVerticalSpace * index;
      const yPositionForCircle = position.y + circleVerticalSpace;

      if (
        app.timeline.circlePositions.length < config.timeline.circles.length
      ) {
        app.timeline.circlePositions.push({
          x: xPositionForCircle,
          y: yPositionForCircle,
        });
      }

      p.push();
      p.stroke(config.timeline.colors.grey);
      timeline.drawCircle?.(index);
      p.pop();

      p.push();
      p.fill(config.timeline.colors.black);
      p.textSize(12);
      p.strokeWeight(0.1);
      p.textFont('sans-serif');
      if (!app.isInteractiveMode) {
        p.text(circleItem.datetime, xPositionForCircle, position.y);
      }
      p.text(circleItem.website, xPositionForCircle, position.y + 20);
      p.pop();

      timeline.drawLineAboveCircle?.(index);
    });
  },
  /**
   * Draws the horizontal timeline line.
   */
  drawTimelineLine: () => {
    if (app.isInteractiveMode) {
      return;
    }

    const { position, colors, circleProps } = config.timeline;
    const { diameter, verticalSpacing } = circleProps;

    const circleVerticalSpace = verticalSpacing + diameter;
    const yPositonForLine = position.y + circleVerticalSpace;
    const p = app.p;

    if (!p) {
      return;
    }

    let x = 0;

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

    while (
      x <=
        circleVerticalSpace * (app.timeline.currentIndex - 1) +
          config.timeline.position.x &&
      app.timeline.currentIndex < config.timeline.circles.length
    ) {
      p.push();
      p.stroke(colors.visitedBlue);
      p.line(0, yPositonForLine, x, yPositonForLine);
      p.pop();
      x = x + 1;
    }
  },

  /**
   * Draws a circle at a given index.
   * @param {number} index - The index of the circle.
   * @param {boolean} [completed] - Whether the circle should be styled as completed.
   */
  drawCircle: (index: number, completed = false) => {
    const { circleProps, user, circles, colors } = config.timeline;
    const position = app.timeline.circlePositions[index];
    const { diameter } = circleProps;
    // const p = app.p;

    if (!app.p || !app.up) {
      return;
    }

    app.p.push();

    if (!completed) {
      app.p.circle(position.x, position.y, diameter);
      return;
    }

    app.p.stroke(colors.visitedBlue);
    app.p.circle(position.x, position.y, diameter);

    app.p.pop();

    if (app.isInteractiveMode) {
      if (app.usedNextOrPrev && app.timeline.currentIndex === index) {
        app.up.image(
          app.p.userIcon,
          position.x - user.width / 2,
          position.y - user.height / 2,
          user.width,
          user.height
        );
        return;
      }

      app.up.push();
      app.up.textSize(16);
      app.up.fill(colors.visitedBlue);
      app.up.stroke(colors.visitedBlue);
      app.up.textStyle(app.up.BOLD);
      app.up.textAlign(app.up.CENTER, app.up.CENTER);
      app.up.text(circles[index].visitedIndex ?? '', position.x, position.y);
      app.up.pop();

      return;
    }

    app.up.push();
    app.up.tint(255, 90);

    if (app.nodeIndexRevisited === -1) {
      app.up.image(
        app.p.openWithoutAnimation,
        position.x - 10,
        position.y + diameter / 2,
        20,
        20
      );
    }

    app.up.pop();

    app.up.image(
      app.p.completedCheckMark,
      position.x - user.width / 2,
      position.y - user.height / 2,
      user.width,
      user.height
    );
  },

  /**
   * Renders the user icon.
   */
  renderUserIcon: () => {
    const { mouseX, mouseY } = app;
    const circlePosition =
      app.isInteractiveMode && app.shouldRespondToClick
        ? { x: mouseX, y: mouseY }
        : app.timeline.circlePositions[app.timeline.currentIndex];

    if (circlePosition === undefined) {
      return;
    }

    const user = config.timeline.user;
    timeline.eraseAndRedraw?.();
    wipeAndRecreateInterestCanvas();

    if (!app.startTrackingMouse) {
      return;
    }

    if (!app.p || !app.up) {
      return;
    }

    app.up.image(
      app.p.userIcon,
      circlePosition.x - user.width / 2,
      circlePosition.y - user.height / 2,
      user.width,
      user.height
    );
  },

  /**
   * Erases and redraws the timeline.
   */
  eraseAndRedraw: () => {
    const currentIndex = app.timeline.currentIndex;
    const { colors } = config.timeline;

    if (app.isInteractiveMode) {
      config.timeline.circles.forEach((circle, index) => {
        if (!app.p) {
          return;
        }

        if (circle.visited === true) {
          app.p.push();
          app.p.stroke(colors.visitedBlue);
          timeline.drawCircle?.(index, true);
          app.p.pop();
        }
      });
      return;
    }

    wipeAndRecreateUserCanvas();

    if (currentIndex > 0) {
      let i = 0;
      while (i < currentIndex) {
        timeline.drawCircle?.(i, config.timeline.circles[i].visited);
        timeline.drawLineAboveCircle?.(i, config.timeline.circles[i].visited);
        i = i + 1;
      }
    }
  },
};

export default timeline;

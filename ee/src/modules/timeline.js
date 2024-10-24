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

const timeline = {};

timeline.init = () => {
  config.timeline.circles.forEach((circle, index) => {
    if (circle.type === 'publisher') {
      app.timeline.circlePublisherIndices.push(index);
    }
  });

  app.timeline.drawTimelineLine();
  app.timeline.drawTimeline(config.timeline);
  app.timeline.renderUserIcon(); // On first render.
};

timeline.drawLineAboveCircle = (index, completed = false) => {
  const { position } = config.timeline;
  const { diameter } = config.timeline.circleProps;
  const p = app.p;
  const positions = app.timeline.circlePositions[index];
  const strokeColor = completed ? '#1A73E8' : '#808080';

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
    p.stroke('#808080');
    timeline.drawCircle(index);
    p.pop();

    p.push();
    p.stroke(0, 0, 0);
    p.textSize(12);
    p.strokeWeight(0.1);
    p.textFont('ui-sans-serif');
    p.text(circleItem.datetime, xPositionForCircle, position.y);
    p.text(circleItem.website, xPositionForCircle, position.y + 20);
    p.pop();

    timeline.drawLineAboveCircle(index);
  });
};

timeline.drawTimelineLine = () => {
  const position = config.timeline.position;
  const { diameter, verticalSpacing } = config.timeline.circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;
  const yPositonForLine = position.y + circleVerticalSpace;
  const p = app.p;
  let x = 0;

  if (app.timeline.currentIndex === 0) {
    p.push();
    p.stroke('#808080');
    app.p.line(
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
      circleVerticalSpace * app.timeline.currentIndex +
        config.timeline.position.x &&
    app.timeline.currentIndex < config.timeline.circles.length
  ) {
    p.push();
    p.stroke(26, 115, 232);
    p.line(0, yPositonForLine, x, yPositonForLine);
    p.stroke(0);
    p.pop();
    x = x + 1;
  }
};

timeline.drawCircle = (index, completed = false) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;

  app.p.circle(position.x, position.y, diameter);

  if (completed) {
    const user = config.timeline.user;
    app.p.image(
      app.p.completedCheckMark,
      position.x - user.width / 2,
      position.y - user.height / 2,
      user.width,
      user.height
    );
  }
};

timeline.drawSmallCircles = (index) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;
  if (!app.timeline.smallCirclePositions[index]) {
    app.timeline.smallCirclePositions[index] = [];
  }
  const distanceFromEdge = 6;

  const numSmallCircles = Math.floor(Math.random() * 3) + 1;
  const p = app.ip;

  const smallCirclePositions = [];

  for (let i = 0; i < numSmallCircles; i++) {
    let randomX, randomY, isOverlapping;

    do {
      const angle = Math.random() * 2 * Math.PI;

      randomX =
        position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
      randomY =
        position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

      // eslint-disable-next-line no-loop-func
      isOverlapping = smallCirclePositions.some((pos) => {
        const dx = pos.x - randomX;
        const dy = pos.y - randomY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < smallCircleDiameter;
      });
    } while (isOverlapping);

    smallCirclePositions.push({ x: randomX, y: randomY });

    const randomColor = p.color(p.random(255), p.random(255), p.random(255));

    p.push();
    p.fill(randomColor);
    app.timeline.smallCirclePositions[index].push([
      randomX,
      randomY,
      randomColor,
    ]);
    p.circle(randomX, randomY, smallCircleDiameter);
    p.pop();
  }
};

timeline.renderUserIcon = () => {
  const circlePosition =
    app.timeline.circlePositions[app.timeline.currentIndex];

  if (circlePosition === undefined) {
    return;
  }

  const user = config.timeline.user;

  timeline.eraseAndRedraw();

  app.p.image(
    app.p.userIcon,
    circlePosition.x - user.width / 2,
    circlePosition.y - user.height / 2,
    user.width,
    user.height
  );
};

timeline.eraseAndRedraw = () => {
  if (app.timeline.currentIndex > 0) {
    timeline.drawTimelineLine();
    let i = 0;
    while (i < app.timeline.currentIndex) {
      app.p.stroke('#1A73E8');
      timeline.drawCircle(i, true);
      app.p.stroke(0);
      timeline.drawLineAboveCircle(i, true);
      i = i + 1;
    }
  }
};

export default timeline;

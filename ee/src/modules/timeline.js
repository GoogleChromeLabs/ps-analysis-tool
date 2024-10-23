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
    timeline.drawCircle(index);

    p.text(circleItem.datetime, xPositionForCircle, position.y);
    p.text(circleItem.website, xPositionForCircle, position.y + 20);

    // Draw line leading out of the circle
    app.p.stroke(26, 115, 232);
    p.line(
      xPositionForCircle,
      yPositionForCircle - diameter / 2,
      xPositionForCircle,
      position.y + 37
    );
    app.p.stroke(0);
  });
};

timeline.drawTimelineLine = () => {
  const position = config.timeline.position;
  const { diameter, verticalSpacing } = config.timeline.circleProps;
  const circleVerticalSpace = verticalSpacing + diameter;
  const yPositonForLine = position.y + circleVerticalSpace;

  app.p.stroke(26, 115, 232);
  app.p.line(
    0,
    yPositonForLine,
    circleVerticalSpace * (config.timeline.circles.length + 1),
    yPositonForLine
  );
  app.p.stroke(0);
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
  const p = app.p;

  const smallCirclePositions = [];

  for (let i = 0; i < numSmallCircles; i++) {
    let randomX, randomY, isOverlapping;

    do {
      const angle = Math.random() * 2 * Math.PI;

      randomX =
        position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
      randomY =
        position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

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
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;
  const lastIndex = app.timeline.currentIndex - 1;

  if (circlePosition === undefined) {
    return;
  }

  const user = config.timeline.user;

  if (app.timeline.currentIndex > 0) {
    app.p.stroke(26, 115, 232);
    timeline.drawCircle(lastIndex, true);
    app.p.stroke(0);

    app.timeline.smallCirclePositions[lastIndex]?.forEach((circleData) => {
      app.p.push();
      app.p.fill(circleData[2]);
      app.p.circle(circleData[0], circleData[1], smallCircleDiameter);
      app.p.pop();
    });
  }

  app.p.image(
    app.p.userIcon,
    circlePosition.x - user.width / 2,
    circlePosition.y - user.height / 2,
    user.width,
    user.height
  );
};

export default timeline;

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
import utils from './utils';

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
  const { position, colors, circleProps } = config.timeline;
  const { diameter, verticalSpacing } = circleProps;

  const circleVerticalSpace = verticalSpacing + diameter;
  const yPositonForLine = position.y + circleVerticalSpace;
  const p = app.p;
  let x = 0;

  if (app.timeline.currentIndex === 0) {
    p.push();
    p.stroke(colors.grey);
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
    app.p.image(
      app.p.completedCheckMark,
      position.x - user.width / 2,
      position.y - user.height / 2,
      user.width,
      user.height
    );
  }
};

timeline.drawSmallCircles = (index, numCircles) => {
  const position = app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;
  const smallCircleRadius = smallCircleDiameter / 2;
  let mainCircleRadius = config.timeline.user.width / 2;

  let accomodatingCircles = Math.round(
    (2 * Math.PI * mainCircleRadius) / (2 * smallCircleRadius)
  );

  if (!app.timeline.smallCirclePositions) {
    app.timeline.smallCirclePositions = [];
  }

  const numSmallCircles = numCircles ?? 9;
  let angleStep = 360 / accomodatingCircles;
  const p = app.igp;
  const maxLen = numCircles
    ? numCircles
    : app.timeline.smallCirclePositions.length + numSmallCircles;
  let totalCircles = numCircles ? 0 : app.timeline.smallCirclePositions.length;

  for (
    let i = numCircles ? 0 : app.timeline.smallCirclePositions.length;
    totalCircles < maxLen;
    i++
  ) {
    if (i > accomodatingCircles) {
      mainCircleRadius += smallCircleDiameter;
      i = i - accomodatingCircles;
      accomodatingCircles = Math.round(
        (2 * Math.PI * mainCircleRadius) / (2 * smallCircleRadius)
      );
      angleStep = 360 / accomodatingCircles;
    }

    const randomX =
      position.x +
      (smallCircleRadius + mainCircleRadius) *
        Math.cos(p.radians(i * angleStep));
    const randomY =
      position.y +
      (smallCircleRadius + mainCircleRadius) *
        Math.sin(p.radians(i * angleStep));
    const randomColor = p.color(p.random(255), p.random(255), p.random(255));

    p.push();
    p.fill(numCircles ? app.timeline.smallCirclePositions[i] : randomColor);
    p.circle(randomX, randomY, smallCircleDiameter);
    totalCircles++;
    p.pop();

    if (!numCircles) {
      app.timeline.smallCirclePositions.push(randomColor);
    }
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

  timeline.drawSmallCircles(
    app.timeline.currentIndex,
    app.timeline.smallCirclePositions.length
  );

  app.p.image(
    app.p.userIcon,
    circlePosition.x - user.width / 2,
    circlePosition.y - user.height / 2,
    user.width,
    user.height
  );
};

timeline.eraseAndRedraw = () => {
  const currentIndex = app.timeline.currentIndex;
  const { colors } = config.timeline;

  if (currentIndex > 0) {
    timeline.drawTimelineLine();
    let i = 0;
    while (i < currentIndex) {
      utils.wipeAndRecreateCanvas();

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

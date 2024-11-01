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
 * External dependencies.
 */
import p5 from 'p5';

/**
 * Internal dependencies.
 */
import app from '../app';
import config from '../config';
import utils from './utils';

const bubbles = {};
bubbles.init = () => {
  app.bubbles.positions = [];
};
bubbles.generateBubbles = () => {
  const igp = app.igp;
  const {
    canvas: { height, width },
  } = config;

  const maxBubbles = config.timeline.circles.reduce((acc, circle) => {
    return (acc += circle?.igGroupsCount ?? 0);
  }, 0);

  let attempts = 0;
  while (bubbles.length < maxBubbles && attempts < maxBubbles * 10) {
    const radius = igp.random(10, 30);
    const x = igp.random(radius, width - radius);
    const y = igp.random(radius, height - radius);
    const newBubble = {
      x,
      y,
      radius,
      color: igp.color(igp.random(255), igp.random(255), igp.random(255)),
    };

    // Check if new bubble overlaps with any existing bubble
    let overlapping = false;
    for (const bubble of bubbles) {
      const d = igp.dist(newBubble.x, newBubble.y, bubble.x, bubble.y);
      if (d < newBubble.radius + bubble.radius) {
        overlapping = true;
        break;
      }
    }

    // Only add bubble if no overlap
    if (!overlapping) {
      app.bubbles.positions.push(newBubble);
    }

    attempts++;
  }
};

bubbles.barrageAnimation = async (index) => {
  const p = app.igp;
  const { mouseX, mouseY } = config;
  const position = config.isInteractiveMode
    ? { x: mouseX, y: mouseY }
    : app.timeline.circlePositions[index];
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;
  const smallCircleRadius = smallCircleDiameter / 2;
  const mainCircleRadius = config.timeline.user.width / 2;
  const accomodatingCircles = Math.round(
    (2 * Math.PI * mainCircleRadius) / (2 * smallCircleRadius)
  );
  const angleStep = 360 / accomodatingCircles;
  const { bottomFlow } = app.auction.auctions[index];

  // calculate the current position of the interest group bubbles.
  const positionsOfCircles = app.bubbles.positions.map((data, i) => {
    const randomX =
      position.x +
      (smallCircleRadius + mainCircleRadius) * Math.cos(i * angleStep);
    const randomY =
      position.y +
      (smallCircleRadius + mainCircleRadius) * Math.sin(i * angleStep);

    const speed = 2;
    const width = config.flow.mediumBox.width;
    const height = config.flow.mediumBox.height;

    // calculate the target where the interest group bubbles have to land;
    const target = p.createVector(
      bottomFlow[0]?.box?.x +
        Math.floor(Math.random() * (1 - width / 2 + 1)) +
        width / 2,
      bottomFlow[0]?.box?.y +
        Math.floor(Math.random() * (1 - height / 2 + 1)) +
        height / 2
    );

    // calculate the opacity of the interest group bubble which will be animated.
    const currentColor = p.color(data.color);
    const color = p.color(
      p.red(currentColor),
      p.green(currentColor),
      p.blue(currentColor),
      128
    );
    return { x: randomX, y: randomY, color, speed, target };
  });

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();
      utils.drawPreviousCircles();

      //Run a loop over the position of the circles to move them according to the speed.
      for (let i = 0; i < positionsOfCircles.length; i++) {
        let { x, y } = positionsOfCircles[i];
        const { target, speed, color } = positionsOfCircles[i];
        const dir = p5.Vector.sub(target, p.createVector(x, y));
        dir.normalize();

        //Only increment the coordinates if the the target is not reached.
        if (
          !(
            x < target.x + 4 &&
            x > target.x - 4 &&
            y < target.y - 4 &&
            y > target.y + 4
          )
        ) {
          x += dir.x * speed;
          y += dir.y * speed;
        }

        p.push();
        p.noStroke();
        p.fill(color);
        p.circle(x, y, smallCircleDiameter);
        p.pop();
        positionsOfCircles[i] = { x, y, target, speed, color };
      }

      //Resolve if all bubbles have reached the targets.
      if (
        positionsOfCircles.every((circle) => {
          return (
            Math.floor(circle.x) < Math.floor(circle.target.x + 4) &&
            Math.floor(circle.x) > Math.floor(circle.target.x - 4) &&
            Math.floor(circle.y) > Math.floor(circle.target.y - 4) &&
            Math.floor(circle.y) < Math.floor(circle.target.y + 4)
          );
        })
      ) {
        clearInterval(app.flow.intervals['circleMovements']);
        resolve();
      }
    }, 10);
  });

  await utils.delay(500);

  utils.wipeAndRecreateInterestCanvas();
};

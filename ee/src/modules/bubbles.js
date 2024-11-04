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

// eslint-disable-next-line complexity
bubbles.generateBubbles = (recalculate = false) => {
  const igp = app.igp;
  const {
    canvas: { height, width },
    bubbles: {
      isExpanded,
      minifiedBubbleX,
      minifiedBubbleY,
      minifiedCircleDiameter,
      interestGroupCounts,
      expandedCircleDiameter,
    },
    timeline: { circles },
  } = config;

  const x = isExpanded ? width / 2 : minifiedBubbleX;
  const y = isExpanded ? height / 2 : minifiedBubbleY;

  const maxBubbles =
    interestGroupCounts +
    (recalculate ? 0 : circles[app.timeline.currentIndex].igGroupsCount ?? 0);

  const expandedCircleRadius = expandedCircleDiameter / 2;
  let accomodatingCircles =
    (expandedCircleRadius / 2) * (expandedCircleRadius / 2);
  let smallCircleRadius = 2;
  while (accomodatingCircles >= maxBubbles) {
    const tempAccomodatingCircles =
      (expandedCircleRadius / smallCircleRadius) *
      (expandedCircleRadius / smallCircleRadius);

    if (tempAccomodatingCircles >= maxBubbles) {
      accomodatingCircles = Math.min(
        accomodatingCircles,
        tempAccomodatingCircles
      );
      smallCircleRadius++;
    } else {
      break;
    }
  }

  const bigRadius =
    (isExpanded ? expandedCircleDiameter : minifiedCircleDiameter) / 2;
  let attempts = 0;
  let i = 0;
  while (
    // eslint-disable-next-line no-unmodified-loop-condition
    ((app.bubbles.positions.length < maxBubbles && !recalculate) ||
      // eslint-disable-next-line no-unmodified-loop-condition
      (recalculate && i < maxBubbles)) &&
    attempts < maxBubbles * 10000
  ) {
    const angle = igp.random(igp.TWO_PI);
    const radius = isExpanded ? igp.random(10, smallCircleRadius) : 5;
    const distanceFromCenter = igp.random(bigRadius - radius);
    const randomX = x + igp.cos(angle) * distanceFromCenter;
    const randomY = y + igp.sin(angle) * distanceFromCenter;
    const newBubble = {
      x: randomX,
      y: randomY,
      radius,
      color: recalculate
        ? app.bubbles.positions[i]?.color
        : igp.color(igp.random(255), igp.random(255), igp.random(255)),
    };

    // Check if new bubble overlaps with any existing bubble
    let overlapping = false;
    if (isExpanded) {
      for (const bubble of app.bubbles.positions) {
        const d = igp.dist(newBubble.x, newBubble.y, bubble.x, bubble.y);
        if (d < newBubble.radius + bubble.radius) {
          overlapping = true;
          break;
        }
      }
    }

    const distToCenter = igp.dist(x, y, randomX, randomY);
    if (!overlapping && distToCenter + radius <= bigRadius) {
      if (recalculate) {
        app.bubbles.positions[i] = newBubble;
      } else {
        app.bubbles.positions.push(newBubble);
      }
      i++;
    }
    attempts++;
  }
};

bubbles.drawSmallCircles = (inBarrage = false) => {
  const igp = app.igp;
  const {
    canvas: { height, width },
    bubbles: {
      isExpanded,
      minifiedBubbleX,
      minifiedBubbleY,
      minifiedCircleDiameter,
      expandedCircleDiameter,
      interestGroupCounts,
    },
  } = config;

  const x = isExpanded ? width / 2 : minifiedBubbleX;
  const y = isExpanded ? height / 2 : minifiedBubbleY;

  igp.circle(
    x,
    y,
    isExpanded ? expandedCircleDiameter : minifiedCircleDiameter
  );

  if (inBarrage) {
    app.bubbles.positions.forEach((bubble, currIndex) => {
      if (currIndex < interestGroupCounts) {
        igp.push();
        igp.fill(bubble.color);
        igp.circle(bubble.x, bubble.y, bubble.radius * 2);
        igp.pop();
      }
    });
  } else {
    app.bubbles.positions.forEach((bubble) => {
      igp.push();
      igp.fill(bubble.color);
      igp.circle(bubble.x, bubble.y, bubble.radius * 2);
      igp.pop();
    });
  }

  if (!isExpanded) {
    igp.push();
    igp.fill(interestGroupCounts < 10 ? 0 : 255);
    igp.textSize(14);
    igp.strokeWeight(1);
    igp.textFont('ui-sans-serif');
    igp.textAlign(igp.CENTER, igp.CENTER);
    igp.text(interestGroupCounts, x, y);
    igp.pop();
  }
};

bubbles.barrageAnimation = async (index) => {
  const p = app.igp;
  const { diameter } = config.timeline.circleProps;
  const { bottomFlow } = app.auction.auctions[index];
  const smallCircleDiameter = diameter / 5;
  const {
    bubbles: { minifiedBubbleX, minifiedBubbleY },
  } = config;

  // calculate the current position of the interest group bubbles.
  const positionsOfCircles = app.bubbles.positions.map((data) => {
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
      200
    );

    return { x: minifiedBubbleX, y: minifiedBubbleY, color, speed, target };
  });

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();
      bubbles.drawSmallCircles(true);

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
  bubbles.drawSmallCircles();
};

bubbles.reverseBarrageAnimation = async (index) => {
  const { dspTags } = app.joinInterestGroup.joinings[index];
  const igp = app.igp;
  const {
    canvas: { height, width },
    bubbles: {
      isExpanded,
      minifiedBubbleX,
      minifiedBubbleY,
      interestGroupCounts,
    },
    timeline: {
      circleProps: { diameter },
    },
  } = config;

  const smallCircleDiameter = diameter / 5;
  const midPointX = isExpanded ? width / 2 : minifiedBubbleX;
  const midPointY = isExpanded ? height / 2 : minifiedBubbleY;

  const positionsOfCircles = [];

  app.bubbles.positions.forEach((data, currIndex) => {
    if (currIndex < interestGroupCounts) {
      return;
    }
    const speed = 1;
    const target = igp.createVector(midPointX, midPointY);
    const flowBoxWidth = config.flow.box.width;
    const flowBoxHeight = config.flow.box.height;

    const currentColor = igp.color(data.color);
    const color = igp.color(
      igp.red(currentColor),
      igp.green(currentColor),
      igp.blue(currentColor)
    );

    positionsOfCircles.push({
      x:
        dspTags[0]?.box?.x +
        Math.floor(Math.random() * (1 - flowBoxWidth / 2 + 1)) +
        flowBoxWidth / 2,
      y:
        dspTags[0]?.box?.y +
        Math.floor(Math.random() * (1 - flowBoxHeight / 2 + 1)) +
        flowBoxHeight / 2,
      color,
      speed,
      target,
    });
  });

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();
      bubbles.drawSmallCircles(true);
      //Run a loop over the position of the circles to move them according to the speed.
      for (let i = 0; i < positionsOfCircles.length; i++) {
        let { x, y } = positionsOfCircles[i];
        const { target, speed, color } = positionsOfCircles[i];
        const dir = p5.Vector.sub(target, igp.createVector(x, y));
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

        igp.push();
        igp.noStroke();
        igp.fill(color);
        igp.circle(x, y, smallCircleDiameter);
        igp.pop();
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

  utils.wipeAndRecreateInterestCanvas();
  bubbles.drawSmallCircles();
};

export default bubbles;

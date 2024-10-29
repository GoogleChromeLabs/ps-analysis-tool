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
import utils from './utils.js';
import app from '../app.js';
import config from '../config.js';
import timeline from './timeline.js';

const flow = {};

flow.createBox = (title, x, y, width, height) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);
  app.p.rect(x, y, width, height);
  app.p.push();
  app.p.strokeWeight(0.1);
  app.p.textFont('ui-sans-serif');
  app.p.text(title, x + width / 2, y + height / 2);
  app.p.pop();
};

flow.progressLine = (x1, y1, x2, y2, direction = 'right', text = '') => {
  const arrowSize = 10;
  const width = config.flow.lineWidth - arrowSize;
  const height = config.flow.lineHeight - arrowSize;
  const incrementBy = 1;
  const p = app.p;

  let _x2 = x1; // For horizontal directions
  let _y2 = y1; // For vertical direction
  let __x2 = x2;

  return new Promise((resolve) => {
    app.flow.intervals['progressline'] = setInterval(() => {
      // Check the direction and adjust the respective coordinate
      if (direction === 'right') {
        _x2 = _x2 + incrementBy;

        // Check if the line has reached the target length for horizontal direction
        if (_x2 - x1 > width) {
          clearInterval(app.flow.intervals['progressline']);
          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line horizontally
        p.line(x1, y1, _x2, y2);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, _x2, y1, direction); // Draw new arrow
      } else if (direction === 'left') {
        __x2 = __x2 - incrementBy;
        const margin = 10;

        if (x2 - __x2 > width) {
          clearInterval(app.flow.intervals['progressline']);

          if (text) {
            p.push();
            p.strokeWeight(0.1);
            p.textSize(config.canvas.fontSize - 2);
            p.textFont('ui-sans-serif');
            p.text(text, __x2 + width / 2, y1 + height / 2);
            p.pop();
          }

          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line horizontally (left direction)
        p.line(x2, y2 + margin, __x2, y1 + margin);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, __x2, y1 + 4, direction); // Draw new arrow
      } else if (direction === 'down') {
        _y2 = _y2 + incrementBy;

        // Check if the line has reached the target length for vertical direction
        if (_y2 - y1 > height) {
          clearInterval(app.flow.intervals['progressline']);

          if (text) {
            p.push();
            p.strokeWeight(0.1);
            p.textSize(config.canvas.fontSize - 2);
            p.textFont('ui-sans-serif');
            p.text(
              text,
              x1 - (text.startsWith('$') ? 10 : width / 2),
              y1 + height / 2
            );
            p.pop();
          }
          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line vertically
        p.line(x1, y1, x2, _y2);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, x1, _y2, direction); // Draw new arrow
      } else if (direction === 'up') {
        _y2 = _y2 - incrementBy;
        // Check if the line has reached the target length for vertical direction
        if (y1 - _y2 > height) {
          clearInterval(app.flow.intervals['progressline']);

          if (text) {
            p.push();
            p.strokeWeight(0.1);
            p.textSize(config.canvas.fontSize - 2);
            p.textFont('ui-sans-serif');
            p.text(
              text,
              x1 + (text.startsWith('$') ? 10 : width / 2),
              y1 - height / 2
            );
            p.pop();
          }

          resolve(); // Resolve the promise once the interval is cleared
        }

        // Draw the progressing line vertically
        p.line(x1, y1, x2, _y2);

        // Draw the arrow in the correct direction
        utils.drawArrow(arrowSize, x1, _y2, direction); // Draw new arrow
      }
    }, 10);
  });
};

flow.calculateXYPostions = (index) => {
  const { circleProps } = config.timeline;
  const { diameter } = circleProps;

  const positions = app.timeline.circlePositions[index];

  return { x: positions.x, y: positions.y + diameter / 2 };
};

flow.createOverrideBox = (x1, y1, x2, height) => {
  const p = app.p;
  const paddingLeft = 1;

  // Calculate the width of the box
  const width = x2 - x1;

  // Calculate the top y-position for the rectangle
  const topY = y1;

  // Draw the rectangle
  p.push();
  p.noStroke(); // Remove the border
  p.fill(config.canvas.background); // Set the fill color from the config
  p.rect(x1 + paddingLeft, topY, width, height); // Draw the rectangle
  p.pop();
};

flow.barrageAnimation = async (index) => {
  const p = app.igp;
  const { bottomFlow } = app.auction.auctions[index];

  // calculate the current position of the interest group bubbles.
  const positionsOfCircles = app.timeline.smallCirclePositions.map((data) => {
    const speed = 1;
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
    return {
      x: data.x,
      y: data.y,
      color,
      speed,
      target,
    };
  });

  await flow.barrageAnimationCoreLogic(
    positionsOfCircles,
    app.auction.auctions[index].bottomFlow
  );
  await utils.delay(500);

  utils.wipeAndRecreateInterestCanvas();
  utils.drawPreviousCircles(index);
};

flow.reverseBarrageAnimation = async (index) => {
  const { dspTags } = app.joinInterestGroup.joinings[index];

  const alreadyAddedIgGroupCount = config.timeline.circles.reduce(
    (acc, circle, currIndex) => {
      if (!circle?.igGroupsCount) {
        return acc;
      }
      if (currIndex < index) {
        acc = acc + circle.igGroupsCount;
        return acc;
      }
      return acc;
    },
    0
  );

  const positionsOfCircles = [];
  app.timeline.smallCirclePositions.forEach((data, currIndex) => {
    if (currIndex < alreadyAddedIgGroupCount) {
      return;
    }

    const speed = 1;
    const width = config.flow.box.width;
    const height = config.flow.box.height;

    // calculate the target where the interest group bubbles have to land;
    const target = app.igp.createVector(data.x, data.y);
    positionsOfCircles.push({
      x:
        dspTags[0]?.box?.x +
        Math.floor(Math.random() * (1 - width / 2 + 1)) +
        width / 2,
      y:
        dspTags[0]?.box?.y +
        Math.floor(Math.random() * (1 - height / 2 + 1)) +
        height / 2,
      color: data.color,
      speed,
      target,
    });
  });

  await flow.barrageAnimationCoreLogic(
    positionsOfCircles,
    app.joinInterestGroup.joinings[index].dspTags,
    true
  );

  await utils.delay(500);
};

flow.barrageAnimationCoreLogic = async (
  positionsOfCircles,
  boundingBox,
  reverseBarrage = false
) => {
  const p = app.igp;
  const { diameter } = config.timeline.circleProps;
  const smallCircleDiameter = diameter / 5;

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();
      if (!reverseBarrage) {
        timeline.generateSmallCircles(
          app.timeline.currentIndex,
          app.timeline.smallCirclePositions.length
        );
      }
      utils.drawPreviousCircles(app.timeline.currentIndex);

      //Calculating the maximum bound of the flow box
      const maxX = boundingBox[0]?.box?.x + config.flow.mediumBox.width;
      const maxY = boundingBox[0]?.box?.y + config.flow.mediumBox.height;

      //Run a loop over the position of the circles to move them according to the speed.
      for (let i = 0; i < positionsOfCircles.length; i++) {
        let { x, y } = positionsOfCircles[i];
        const { target, speed, color } = positionsOfCircles[i];
        const dir = p5.Vector.sub(target, p.createVector(x, y));
        dir.normalize();

        if (reverseBarrage) {
          if (
            !(
              x < target.x + 2 &&
              x > target.x - 2 &&
              y < target.y - 2 &&
              y > target.y + 2
            )
          ) {
            x += dir.x * speed;
            y += dir.y * speed;
          }
        } else {
          if (!(x < maxX && x > target.x && y < maxY && y > target.y)) {
            x += dir.x * speed;
            y += dir.y * speed;
          }
        }

        p.push();
        p.noStroke();
        p.fill(color);
        p.circle(x, y, smallCircleDiameter);
        p.pop();
        positionsOfCircles[i] = {
          x,
          y,
          target,
          speed,
          color,
        };
      }
      //Resolve if all bubbles have reached the targets.
      if (
        positionsOfCircles.every((circle) => {
          return (
            Math.floor(circle.x) < Math.floor(circle.target.x + 2) &&
            Math.floor(circle.x) > Math.floor(circle.target.x - 2) &&
            Math.floor(circle.y) > Math.floor(circle.target.y - 2) &&
            Math.floor(circle.y) < Math.floor(circle.target.y + 2)
          );
        })
      ) {
        clearInterval(app.flow.intervals['circleMovements']);
        resolve();
      }
    }, 10);
  });
};

export default flow;

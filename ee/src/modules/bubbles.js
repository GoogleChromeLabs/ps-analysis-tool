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
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';

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
  const color = igp.color(
    igp.random(80, 255),
    igp.random(140, 255),
    igp.random(120, 255)
  );

  const interestGroupsToBeAdded =
    config.timeline.circles[app.timeline.currentIndex].igGroupsCount ?? 0;
  const previouslyAddedInterestGroup = config.bubbles.interestGroupCounts;

  if (!recalculate) {
    for (let index = 0; index < interestGroupsToBeAdded; index++) {
      app.bubbles.positions.push({
        id: uuidv4(),
        value: previouslyAddedInterestGroup + index,
        color,
      });
    }
  }
  bubbles.generateExpandedBubbles();
  bubbles.generateMinifiedBubbles();
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
    if (isExpanded) {
      bubbles.showExpandedBubbles(true);
    }

    bubbles.showMinifiedBubbles();
  } else {
    if (isExpanded) {
      bubbles.showExpandedBubbles();
      return;
    }

    bubbles.showMinifiedBubbles();
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

    return { x: data.x, y: data.y, color, speed, target };
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
bubbles.generateExpandedBubbles = () => {
  const assembledData = {
    name: 'root',
    children: app.bubbles.positions,
  };

  const root = d3
    .hierarchy(assembledData)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3.pack().size([config.canvas.width, config.canvas.height]).padding(3)(root);

  const expandedNodes = root.descendants();

  const nodeMap = {};

  expandedNodes.forEach((node) => {
    nodeMap[node.data.id] = node;
  });

  app.bubbles.positions = app.bubbles.positions.map((_data) => {
    return {
      ..._data,
      expanded: {
        x: nodeMap[_data.id].x,
        y: nodeMap[_data.id].y,
        r: nodeMap[_data.id].r,
      },
    };
  });
};
bubbles.showExpandedBubbles = (inBarrage = false) => {
  const igp = app.igp;
  const {
    canvas: { height, width },
    bubbles: { isExpanded, minifiedBubbleX, minifiedBubbleY },
  } = config;

  if (app.bubbles.positions.length === 0) {
    const x = isExpanded ? width / 2 : minifiedBubbleX;
    const y = isExpanded ? height / 2 : minifiedBubbleY;

    igp.circle(x, y, config.bubbles.expandedCircleDiameter);
    return;
  }

  if (!inBarrage) {
    const { x, y, r } = d3.packEnclose(
      app.bubbles.positions.map((data) => {
        return {
          ...data.expanded,
        };
      })
    );

    igp.circle(x, y, r * 2);
  }

  for (const node of app.bubbles.positions) {
    if (!node.children) {
      app.igp.push();
      app.igp.fill(node.color);
      app.igp.ellipse(node.expanded.x, node.expanded.y, node.expanded.r * 2);
      app.igp.fill(0);
      app.igp.textSize(node.expanded.r / 4);
      app.igp.text(node.id, node.expanded.x, node.expanded.y);
      app.igp.pop();
    }
  }
};
bubbles.generateMinifiedBubbles = () => {
  const {
    bubbles: { minifiedBubbleX, minifiedBubbleY, minifiedCircleDiameter },
  } = config;

  const assembledData = {
    name: 'root',
    children: app.bubbles.positions,
  };

  const root = d3
    .hierarchy(assembledData)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  d3
    .pack()
    .size([
      config.bubbles.minifiedCircleDiameter,
      config.bubbles.minifiedCircleDiameter,
    ])
    .padding(3)(root);

  const minifiedNodes = root.descendants();

  const nodeMap = {};

  minifiedNodes.forEach((node) => {
    nodeMap[node.data.id] = node;
  });

  const smallCircleX = minifiedBubbleX - minifiedCircleDiameter / 2;
  const smallCircleY = minifiedBubbleY - minifiedCircleDiameter / 2;

  app.bubbles.positions = app.bubbles.positions.map((_data) => {
    return {
      ..._data,
      minified: {
        x: smallCircleX + nodeMap[_data.id].x + nodeMap[_data.id].r,
        y: smallCircleY + nodeMap[_data.id].y + nodeMap[_data.id].r,
        r: nodeMap[_data.id].r,
      },
    };
  });
};
bubbles.showMinifiedBubbles = () => {
  const igp = app.igp;
  const {
    bubbles: { minifiedBubbleX, minifiedBubbleY },
  } = config;

  igp.circle(minifiedBubbleX, minifiedBubbleY, 50);

  for (const node of app.bubbles.positions) {
    if (!node.children) {
      igp.push();
      igp.fill(node.color);
      igp.ellipse(node.minified.x, node.minified.y, node.minified.r * 2);
      igp.pop();
    }
  }
};

export default bubbles;

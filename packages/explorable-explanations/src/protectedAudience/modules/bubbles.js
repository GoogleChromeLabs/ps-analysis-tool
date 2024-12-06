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

/**
 * Internal dependencies.
 */
import app from '../app';
import config from '../config';
import * as utils from '../utils';

/**
 * @module bubbles
 * Handles interest group bubbles.
 */
const bubbles = {};

/**
 * Initializes the bubbles module by setting up the initial state.
 *
 * Resets the positions of the interest group bubbles in the `app.bubbles` object.
 */
bubbles.init = () => {
  app.bubbles.positions = [];
};

/**
 * Generates interest group bubbles for the current timeline index.
 *
 * Populates the `app.bubbles.positions` array with data for each bubble, including its
 * ID, value, group, and color. If recalculation is not needed, it maps the data
 * to unique colors using D3.
 * @param {boolean} [recalculate] - Whether to recalculate and regenerate all bubbles.
 */
bubbles.generateBubbles = (recalculate = false) => {
  const currIndex = app.timeline.currentIndex;

  if (currIndex >= config.timeline.circles.length) {
    return;
  }
  if (!recalculate) {
    config.timeline.circles[currIndex].interestGroups?.forEach((igGroup) => {
      app.bubbles.positions.push({
        id: igGroup,
        value: igGroup.length,
        group: config.timeline.circles[currIndex].website,
        color: app.color(config.timeline.circles[currIndex].website),
      });
    });
  }
};

/**
 * Animates the movement of interest group bubbles to their target positions.
 *
 * Simulates a "barrage" animation where bubbles move from their initial positions
 * (minified or expanded) to specified target locations. The animation respects the
 * `isPaused` state of the timeline.
 * @param {number} index - The index of the timeline for which the animation is being run.
 * @returns {Promise<void>} Resolves when all bubbles have reached their target positions.
 */
bubbles.barrageAnimation = async (index) => {
  const p = app.igp;
  const {
    canvas: { height: canvasHeight, width: canvasWidth },
    timeline: {
      circleProps: { diameter },
    },
  } = config;

  const {
    bubbles: { isExpanded },
  } = app;

  const boxes = app.auction.auctions[index];
  const loadInterestGroupBox = boxes.find(
    (box) => box?.props?.title === 'Load Interest Group'
  );

  const smallCircleDiameter = diameter / 5;
  const width = config.flow.mediumBox.width;
  const height = config.flow.mediumBox.height;

  // Calculate the current position of the interest group bubbles.
  const positionsOfCircles = app.bubbles.positions.map((data) => {
    const targetX =
      loadInterestGroupBox?.props?.x() +
      p.random(smallCircleDiameter, width / 2);
    const targetY =
      loadInterestGroupBox?.props?.y() +
      p.random(smallCircleDiameter, height / 2);
    // Calculate the target where the interest group bubbles have to land.
    const target = p.createVector(targetX, targetY);

    // Calculate the opacity of the interest group bubble which will be animated.
    const currentColor = p.color(data.color);
    const color = p.color(
      p.red(currentColor),
      p.green(currentColor),
      p.blue(currentColor),
      200
    );
    const x = isExpanded ? canvasWidth / 2 : 35;
    const y = isExpanded ? canvasHeight / 2 : 35;
    const distance = p.dist(x, y, targetX, targetY);
    const speedX = distance / 250;

    return { x, y, color, speed: speedX, target };
  });

  await new Promise((resolve) => {
    const animate = () => {
      if (app.cancelPromise) {
        resolve();
        return;
      }

      if (app.timeline.isPaused) {
        requestAnimationFrame(animate); // Keep the animation loop alive but paused.
        return;
      }

      utils.wipeAndRecreateInterestCanvas();

      for (let i = 0; i < positionsOfCircles.length; i++) {
        if (app.cancelPromise) {
          resolve();
          return;
        }

        let { x, y } = positionsOfCircles[i];
        const { target, speed, color } = positionsOfCircles[i];
        const dir = p5.Vector.sub(target, p.createVector(x, y));
        dir.normalize();

        // Only increment the coordinates if the target is not reached.
        x += dir.x * speed;
        y += dir.y * speed;

        p.push();
        p.noStroke();
        p.fill(color);
        p.circle(x, y, smallCircleDiameter);
        p.pop();
        positionsOfCircles[i] = { x, y, target, speed, color };
      }

      // Resolve if all bubbles have reached their targets.
      if (
        positionsOfCircles.every((circle) => {
          const topOfBox = loadInterestGroupBox?.props?.y();
          const leftOfBox = loadInterestGroupBox?.props?.x();
          const x = Math.floor(circle.x);
          const y = Math.floor(circle.y);
          return (
            x > leftOfBox &&
            x < leftOfBox + width &&
            y > topOfBox &&
            y < topOfBox + height
          );
        }) ||
        app.cancelPromise
      ) {
        resolve();
      } else {
        requestAnimationFrame(animate); // Continue the animation.
      }
    };

    requestAnimationFrame(animate); // Start the animation loop.
  });

  await utils.delay(500);

  utils.wipeAndRecreateInterestCanvas();
};

/**
 * Animates the movement of interest group bubbles back to their initial positions.
 *
 * Simulates a "reverse barrage" animation where bubbles move from their target positions
 * to a centralized location (minified or expanded). The animation respects the `isPaused`
 * state of the timeline.
 * @param {number} index - The index of the timeline from which the bubbles are being reversed.
 * @returns {Promise<void>} Resolves when all bubbles have returned to their original positions.
 */
bubbles.reverseBarrageAnimation = async (index) => {
  const dspTags = app.joinInterestGroup.joinings[index][1];
  const igp = app.igp;
  const {
    timeline: {
      circleProps: { diameter },
      circles,
    },
  } = config;

  const {
    bubbles: { isExpanded, interestGroupCounts },
  } = app;

  const smallCircleDiameter = diameter / 5;
  const midPointX = isExpanded ? config.canvas.width / 4 + 320 : 35;
  const midPointY = isExpanded ? 320 : 35;

  const positionsOfCircles = [];
  const currentIGGroupToBeAdded = circles[index]?.igGroupsCount ?? 0;

  for (let i = 0; i < interestGroupCounts + currentIGGroupToBeAdded; i++) {
    if (i < interestGroupCounts) {
      continue;
    }

    const flowBoxWidth = config.flow.box.width;
    const flowBoxHeight = config.flow.box.height;
    const target = igp.createVector(midPointX, midPointY);

    const { color: currentColor } = app.bubbles.positions[i];
    const color = currentColor;
    const x =
      dspTags?.props?.x() +
      Math.floor(Math.random() * (1 - flowBoxWidth / 2 + 1)) +
      flowBoxWidth / 2;

    const y =
      dspTags?.props?.y() +
      Math.floor(Math.random() * (1 - flowBoxHeight / 2 + 1)) +
      flowBoxHeight / 2;

    const distance = igp.dist(x, y, midPointX, midPointY);
    const speedX = distance / 250;

    positionsOfCircles.push({
      x:
        dspTags?.props?.x() +
        Math.floor(Math.random() * (1 - flowBoxWidth / 2 + 1)) +
        flowBoxWidth / 2,
      y:
        dspTags?.props?.y() +
        Math.floor(Math.random() * (1 - flowBoxHeight / 2 + 1)) +
        flowBoxHeight / 2,
      color,
      speed: speedX,
      target,
    });
  }

  document.getElementById('interest-canvas').style.zIndex = 4;

  await new Promise((resolve) => {
    const animate = () => {
      if (app.cancelPromise) {
        resolve();
        return;
      }

      if (app.timeline.isPaused) {
        requestAnimationFrame(animate);
        return;
      }

      utils.wipeAndRecreateInterestCanvas();

      for (let i = 0; i < positionsOfCircles.length; i++) {
        if (app.cancelPromise) {
          resolve();
          return;
        }

        let { x, y } = positionsOfCircles[i];
        const { target, speed, color } = positionsOfCircles[i];
        const dir = p5.Vector.sub(target, igp.createVector(x, y));

        dir.normalize();

        x += dir.x * speed;
        y += dir.y * speed;

        igp.push();
        igp.noStroke();
        igp.fill(color);
        igp.circle(x, y, smallCircleDiameter);
        igp.pop();

        positionsOfCircles[i] = { x, y, target, speed, color };
      }

      // Resolve if all bubbles have reached the targets
      if (
        positionsOfCircles.every((circle) => {
          return (
            Math.abs(circle.x - circle.target.x) <
              app.bubbles.minifiedCircleDiameter / 2 &&
            Math.abs(circle.y - circle.target.y) <
              app.bubbles.minifiedCircleDiameter / 2
          );
        }) ||
        app.cancelPromise
      ) {
        resolve();
        document.getElementById('interest-canvas').style.zIndex = 2;
        utils.wipeAndRecreateInterestCanvas();
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  });
};

bubbles.showExpandedBubbles = () => {
  bubbles.clearAndRewriteBubbles();
  bubbles.generateBubbles(true);

  app.bubbles.expandedSVG = bubbles.bubbleChart(app.bubbles.positions, {
    label: (d) =>
      [
        ...d.id
          .split('.')
          .pop()
          .split(/(?=[A-Z][a-z])/g),
      ].join('\n'),
    value: (d) => d.value,
    groupFn: (d) => d.group,
    title: (d) => `${d.id}\n${d.value.toLocaleString('en')}`,
    width: app.bubbles.expandedCircleDiameter,
    height: app.bubbles.expandedCircleDiameter,
    margin: 4,
  });

  if (app.bubbles.expandedSVG) {
    app.minifiedBubbleContainer.appendChild(app.bubbles.expandedSVG);
  }

  app.bubbleContainerDiv.classList.toggle('expanded', true);

  app.closeButton.style.display = 'block';
  app.openButton.style.display = 'none';
  app.minifiedBubbleContainer.classList.toggle('expanded', true);
};
bubbles.showMinifiedBubbles = () => {
  app.bubbles.minifiedSVG = bubbles.bubbleChart(app.bubbles.positions, {
    label: (d) =>
      [
        ...d.id
          .split('.')
          .pop()
          .split(/(?=[A-Z][a-z])/g),
      ].join('\n'),
    value: (d) => d.value,
    groupFn: (d) => d.group,
    title: (d) => `${d.id}\n${d.value.toLocaleString('en')}`,
    width: app.bubbles.minifiedCircleDiameter,
    height: app.bubbles.minifiedCircleDiameter,
  });

  if (app.bubbles.isExpanded) {
    return;
  }

  app.bubbleContainerDiv.classList.toggle('expanded', false);

  app.closeButton.style.display = 'none';
  app.openButton.style.display = 'block';

  bubbles.clearAndRewriteBubbles();

  app.minifiedBubbleContainer.style.backgroundColor = 'white';

  app.countDisplay.innerHTML = app.bubbles.interestGroupCounts;

  if (app.bubbles.minifiedSVG) {
    app.minifiedBubbleContainer.appendChild(app.bubbles.minifiedSVG);
  }

  app.minifiedBubbleContainer.classList.toggle('expanded', false);
};

bubbles.bubbleChart = (
  data,
  {
    name = ([x]) => x,
    label = name,
    value = ([, y]) => y,
    groupFn,
    title,
    width = 640,
    height = width,
    padding = 3,
    margin = 1,
    marginTop = margin,
    marginRight = margin,
    marginBottom = margin,
    marginLeft = margin,
    groupsParams,
    fill = '#ccc',
    fillOpacity = 0.7,
    stroke,
    strokeWidth,
    strokeOpacity,
  } = {}
) => {
  const totalBubbles = bubbles.calculateTotalBubblesForAnimation(
    app.timeline.currentIndex
  );

  data = data.filter((_data, i) => {
    if (i < totalBubbles) {
      return true;
    }
    return false;
  });

  if (data.length === 0) {
    return null;
  }

  const values = d3.map(data, value);
  const groups = groupFn === null ? null : d3.map(data, groupFn);
  const groupIntervals = d3.range(values.length).filter((i) => values[i] > 0);

  if (groups && groupsParams === undefined) {
    groupsParams = groupIntervals.map((i) => groups[i]);
  }

  groupsParams = groupFn && new d3.InternSet(groupsParams);
  const labels = label === null ? null : d3.map(data, label);
  const titles =
    title === undefined ? labels : title === null ? null : d3.map(data, title);

  const root = d3
    .pack()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .padding(padding)(
    d3.hierarchy({ children: groupIntervals }).sum((i) => values[i])
  );

  const svg = d3
    .create('svg')
    .attr('id', !app.bubbles.isExpanded ? 'minimisedSVG' : 'expandedSVG')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-marginLeft, -marginTop, width, height])
    .attr(
      'style',
      `max-width: 100%; height: auto; height: intrinsic;${
        !app.bubbles.isExpanded ? 'pointer-events: none;' : ''
      }`
    )
    .attr('fill', 'currentColor')
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle');

  const leaf = svg
    .selectAll('a')
    .data(root.leaves())
    .join('a')
    .attr('style', `${!app.bubbles.isExpanded ? 'pointer-events: none;' : ''}`)
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  const eventHandler = (event) => {
    // eslint-disable-next-line no-console
    console.log(event);
    app.igp.igClick();
    event.stopPropagation();
  };

  leaf
    .append('circle')
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-opacity', strokeOpacity)
    .attr('class', 'svg overflowing-text circle-svg')
    .attr('style', `${!app.bubbles.isExpanded ? 'pointer-events: none;' : ''}`)
    .attr(
      'fill',
      groups
        ? (d) => {
            return app.color(groups[d.data]);
          }
        : fill === null
        ? 'none'
        : fill
    )
    .on('click', !app.bubbles.isExpanded ? null : eventHandler)
    .attr('fill-opacity', fillOpacity)
    .attr('r', (d) => {
      return d.r;
    });

  if (labels) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    leaf
      .append('clipPath')
      .attr('id', (d) => `${uid}-clip-${d.data}`)
      .append('circle')
      .attr('class', 'svg overflowing-text')
      .attr('r', (d) => d.r);

    if (app.bubbles.isExpanded) {
      if (titles) {
        leaf.append('title').text((d) => titles[d.data]);
      }

      leaf
        .append('text')
        .attr(
          'clip-path',
          (d) => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`
        )
        .attr('class', 'svg text-class')
        .selectAll('tspan')
        .data((d) => `${labels[d.data]}`.split(/\n/g))
        .join('tspan')
        .attr('x', 0)
        .attr('y', (d, i, D) => `${i - D.length / 2 + 0.85}em`)
        .attr('fill-opacity', (d, i, D) => (i === D.length - 1 ? 0.7 : null))
        .text((d) => d);
    }
  }

  return Object.assign(svg.node(), { scales: { color: app.color } });
};

bubbles.clearAndRewriteBubbles = () => {
  if (!app.minifiedBubbleContainer) {
    return;
  }

  app.minifiedBubbleContainer.innerHTML = '';

  if (!app.bubbles.isExpanded) {
    app.countDisplay.innerHTML = app.bubbles.interestGroupCounts;
    app.minifiedBubbleContainer.appendChild(app.countDisplay);
  }
};

bubbles.calculateTotalBubblesForAnimation = (index) => {
  let bubblesCount = 0;
  if (app.isInteractiveMode) {
    config.timeline.circles.forEach((circle) => {
      if (circle.visited) {
        bubblesCount += circle.igGroupsCount ?? 0;
      }
    });
    return bubblesCount;
  }

  config.timeline.circles.forEach((circle, currIndex) => {
    if (currIndex < index) {
      bubblesCount += circle.igGroupsCount ?? 0;
    }
  });

  return bubblesCount;
};

export default bubbles;

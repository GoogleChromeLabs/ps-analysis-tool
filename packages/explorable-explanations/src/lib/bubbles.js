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
import utils from './utils';

const bubbles = {};

bubbles.init = () => {
  app.bubbles.positions = [];
};
bubbles.generateBubbles = (recalculate = false) => {
  const igp = app.igp;
  const color = igp.color(
    igp.random(80, 255),
    igp.random(140, 255),
    igp.random(120, 255)
  );

  const interestGroupsToBeAdded =
    config.timeline.circles[app.timeline.currentIndex]?.igGroupsCount ?? 0;

  if (!recalculate) {
    for (let index = 0; index < interestGroupsToBeAdded; index++) {
      app.bubbles.positions.push({
        id: config.timeline.circles[app.timeline.currentIndex].interestGroups[
          index
        ],
        value:
          config.timeline.circles[app.timeline.currentIndex].interestGroups[
            index
          ].length,
        group: config.timeline.circles[app.timeline.currentIndex].website,
        color,
      });
    }
  }

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
    width: config.bubbles.minifiedCircleDiameter,
    height: config.bubbles.minifiedCircleDiameter,
  });

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
    width: config.canvas.height,
    height: config.canvas.height,
    margin: 4,
  });
};

bubbles.barrageAnimation = async (index) => {
  const p = app.igp;
  const {
    canvas: { height: canvasHeight, width: canvasWidth },
    bubbles: { isExpanded, minifiedBubbleX, minifiedBubbleY },
    timeline: {
      circleProps: { diameter },
    },
  } = config;
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
    const x = isExpanded ? canvasWidth / 2 : minifiedBubbleX;
    const y = isExpanded ? canvasHeight / 2 : minifiedBubbleY;

    return { x, y, color, speed, target };
  });

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();

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
bubbles.reverseBarrageAnimation = async (index) => {
  const dspTags = app.joinInterestGroup.joinings[index][1];
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
      circles,
    },
  } = config;

  const smallCircleDiameter = diameter / 5;
  const midPointX = isExpanded ? width / 2 : minifiedBubbleX;
  const midPointY = isExpanded ? height / 2 : minifiedBubbleY;

  const positionsOfCircles = [];
  const currentIGGroupToBeAdded = circles[index]?.igGroupsCount ?? 0;
  for (let i = 0; i < interestGroupCounts + currentIGGroupToBeAdded; i++) {
    if (i < interestGroupCounts) {
      continue;
    }

    const flowBoxWidth = config.flow.box.width;
    const flowBoxHeight = config.flow.box.height;
    const speed = 1;
    const target = igp.createVector(midPointX, midPointY);

    const { color: currentColor } = app.bubbles.positions[i];
    const color = currentColor;

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
      speed,
      target,
    });
  }

  document.getElementById('interest-canvas').style.zIndex = 4;

  await new Promise((resolve) => {
    app.flow.intervals['circleMovements'] = setInterval(() => {
      utils.wipeAndRecreateInterestCanvas();
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

  document.getElementById('interest-canvas').style.zIndex = 2;
  utils.wipeAndRecreateInterestCanvas();
};
bubbles.showExpandedBubbles = () => {
  bubbles.clearAndRewriteBubbles();
  bubbles.generateBubbles(true);

  if (app.bubbles.expandedSVG) {
    app.minifiedBubbleContainer.appendChild(app.bubbles.expandedSVG);
  }

  document
    .getElementById('bubble-container-div')
    .classList.toggle('expanded', true);

  document.getElementById('close-button').style.display = 'block';

  app.minifiedBubbleContainer.classList.toggle('expanded', true);
};
bubbles.showMinifiedBubbles = () => {
  if (config.bubbles.isExpanded) {
    return;
  }

  document
    .getElementById('bubble-container-div')
    .classList.toggle('expanded', false);

  document.getElementById('close-button').style.display = 'none';

  bubbles.clearAndRewriteBubbles();

  app.minifiedBubbleContainer.style.backgroundColor = 'white';

  document.getElementById('count-display').innerHTML =
    config.bubbles.interestGroupCounts;

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
    colors = d3.schemeTableau10,
    fill = '#ccc',
    fillOpacity = 0.7,
    stroke,
    strokeWidth,
    strokeOpacity,
  } = {}
) => {
  const values = d3.map(data, value);
  const groups = groupFn === null ? null : d3.map(data, groupFn);
  const groupIntervals = d3.range(values.length).filter((i) => values[i] > 0);

  if (groups && groupsParams === undefined) {
    groupsParams = groupIntervals.map((i) => groups[i]);
  }

  groupsParams = groupFn && new d3.InternSet(groupsParams);
  const color = groups && d3.scaleOrdinal(groups, colors);
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
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-marginLeft, -marginTop, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('fill', 'currentColor')
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', 'middle')
    .on(
      'click',
      !config.bubbles.isExpanded
        ? () => {
            config.bubbles.isExpanded = true;
            bubbles.generateBubbles(true);
            app.pause();
          }
        : null
    );

  const leaf = svg
    .selectAll('a')
    .data(root.leaves())
    .join('a')
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  app.bubbles.positions = app.bubbles.positions.map((_data, i) => {
    const nodes = root.leaves();
    return {
      ..._data,
      color: color(groups[nodes[i].data]),
    };
  });

  leaf
    .append('circle')
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-opacity', strokeOpacity)
    .attr('class', 'svg overflowing-text')
    .attr(
      'fill',
      groups
        ? (d) => {
            return color(groups[d.data]);
          }
        : fill === null
        ? 'none'
        : fill
    )
    .on(
      'click',
      !config.bubbles.isExpanded
        ? null
        : (event) => {
            if (!config.bubbles.isExpanded) {
              config.bubbles.isExpanded = true;
              bubbles.generateBubbles(true);
              app.pause();
            } else {
              // eslint-disable-next-line no-console
              console.log(event);
            }
          }
    )
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

    if (config.bubbles.isExpanded) {
      if (titles) {
        leaf.append('title').text((d) => titles[d.data]);
      }

      leaf
        .append('text')
        .attr(
          'clip-path',
          (d) => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`
        )
        .attr('class', 'svg')
        .selectAll('tspan')
        .data((d) => `${labels[d.data]}`.split(/\n/g))
        .join('tspan')
        .attr('x', 0)
        .attr('y', (d, i, D) => `${i - D.length / 2 + 0.85}em`)
        .attr('fill-opacity', (d, i, D) => (i === D.length - 1 ? 0.7 : null))
        .text((d) => d);
    }
  }

  return Object.assign(svg.node(), { scales: { color } });
};

bubbles.clearAndRewriteBubbles = () => {
  if (!app.minifiedBubbleContainer) {
    return;
  }
  const countDisplay =
    app.minifiedBubbleContainer.querySelector('[id=count-display]');
  app.minifiedBubbleContainer.innerHTML = '';

  if (!config.bubbles.isExpanded) {
    app.minifiedBubbleContainer.appendChild(countDisplay);
  }
};

export default bubbles;

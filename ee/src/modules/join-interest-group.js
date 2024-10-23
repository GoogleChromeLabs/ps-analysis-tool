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
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import timeline from './timeline';

const joinInterestGroup = {};

joinInterestGroup.setupJoinings = () => {
  config.timeline.circles.forEach((circle, index) => {
    joinInterestGroup.setUp(index);
  });
};

joinInterestGroup.setUp = (index) => {
  const { circles } = config.timeline;
  const { box, smallBox, lineHeight } = config.flow;
  const currentCircle = circles[index];
  const _joining = {};

  const { x, y } = flow.calculateXYPostions(index);

  if (currentCircle.type !== 'advertiser') {
    app.joinInterestGroup.joinings.push(null);
    return;
  }

  // Setup DSP blocks
  _joining.dspTags = [];

  _joining.dspTags.push({
    name: 'DSP Tag',
    box: {
      x: x - box.width / 2,
      y: y + box.height / 2 + 2,
      width: box.width,
      height: box.height,
    },
    line: {
      x1: x,
      y1: y,
      x2: x,
      y2: y + lineHeight,
      speed: 0.6,
      direction: 'down',
      text: 'joinInterestGroup()',
    },
  });

  _joining.dspTags.push({
    name: 'DSP Tag',
    line: {
      x1: x + 10,
      y1: y + lineHeight,
      x2: x + 10,
      y2: y,
      speed: 0.6,
      direction: 'up',
    },
  });

  // Setup DSP blocks
  _joining.dsp = [];

  for (let i = 0; i <= 1; i++) {
    const title = 'DSP ' + (i + 1);

    const xForSmallBox = i % 2 === 0 ? x - box.width / 1.5 : x + box.width / 4;
    const xForSmallBoxLine =
      i % 2 === 0 ? x - box.width / 2 : x + box.width / 4;

    _joining.dsp.push({
      name: title,
      box: {
        x: xForSmallBox,
        y: y + box.height + lineHeight * 2 + 7,
        width: smallBox.width,
        height: smallBox.height,
      },
      line: {
        x1: xForSmallBoxLine + 20,
        y1: y + box.height + lineHeight + 5,
        x2: xForSmallBoxLine + 20,
        y2: y + box.height + lineHeight * 2,
        speed: 0.05,
        direction: 'down',
      },
    });

    _joining.dsp.push({
      name: title,
      line: {
        x1: xForSmallBoxLine + 10,
        y1: y + box.height + lineHeight * 2 + 7,
        x2: xForSmallBoxLine + 10,
        y2: y + box.height + lineHeight + 5,
        speed: 0.05,
        direction: 'up',
      },
    });
  }

  app.joinInterestGroup.joinings.push(_joining);
};

joinInterestGroup.draw = async (index) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);

  const _joining = app.joinInterestGroup.joinings[index];

  if (!_joining) {
    return;
  }

  // Helper function to draw lines and boxes
  const drawLineAndBox = async (item) => {
    await drawLine(item);
    await drawBox(item);
  };

  const drawLine = async (item) => {
    await flow.progressLine(
      item.line.x1,
      item.line.y1,
      item.line.x2,
      item.line.y2,
      item.line?.direction,
      item.line?.text
    );
  };

  const drawBox = (item) => {
    if (item.box) {
      flow.createBox(
        item.name,
        item.box.x,
        item.box.y,
        item.box.width,
        item.box.height
      );
    }
  };

  // Draw DSP Tags box and line
  await drawLineAndBox(_joining.dspTags[0]);

  await utils.delay(500);

  // Sequentially draw DSP boxes and lines
  const dsp = _joining.dsp;
  for (const dspItem of dsp) {
    // eslint-disable-next-line no-await-in-loop
    await drawLineAndBox(dspItem); // Sequential execution for DSP items
  }

  await drawLine(_joining.dspTags[1]);

  timeline.drawSmallCircles(index);

  await utils.delay(1500);

  joinInterestGroup.remove(index);
};

joinInterestGroup.remove = (index) => {
  const { dspTags, dsp } = app.joinInterestGroup.joinings[index];
  const x1 = dsp[0]?.box?.x - 10;
  const y1 = dspTags[0]?.line?.y1;
  const x2 = dspTags[0]?.box?.x + config.flow.box.width * 2;

  const height =
    config.flow.box.height +
    config.flow.smallBox.height +
    config.flow.lineWidth +
    config.timeline.circleProps.diameter;

  flow.createOverrideBox(x1, y1, x2, height);
};

export default joinInterestGroup;

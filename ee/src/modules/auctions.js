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
import flow from './flow';
import app from '../app';
import config from '../config';
import utils from './utils';
import rippleEffect from './ripple-effect';

const auction = {};

auction.setupAuctions = () => {
  config.timeline.circles.forEach((circle, index) => {
    auction.setUp(index);
  });
};

auction.setUp = (index) => {
  const { circles } = config.timeline;
  const { box, smallBox, mediumBox, lineWidth, lineHeight } = config.flow;
  const currentCircle = circles[index];
  const _auction = {};

  const { x, y } = flow.calculateXYPostions(index);

  if (currentCircle.type !== 'publisher') {
    app.auction.auctions.push(null);
    return;
  }

  // Setup DSP blocks
  _auction.ssp = {
    name: 'SSP',
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
    },
  };

  // Setup DSP blocks
  _auction.dsp = [];

  for (let i = 0; i <= 1; i++) {
    const title = 'DSP ' + (i + 1);

    const xForSmallBox = i % 2 === 0 ? x - box.width / 1.5 : x + box.width / 4;
    const xForSmallBoxLine =
      i % 2 === 0 ? x - box.width / 2 : x + box.width / 4;

    _auction.dsp.push({
      name: title,
      box: {
        x: xForSmallBox,
        y: y + box.height + lineHeight * 2 + 7,
        width: smallBox.width,
        height: smallBox.height,
      },
      line: {
        x1: xForSmallBoxLine + 10,
        y1: y + box.height + lineHeight + 5,
        x2: xForSmallBoxLine + 10,
        y2: y + box.height + lineHeight * 2,
        speed: 0.05,
        direction: 'down',
      },
    });

    _auction.dsp.push({
      name: title,
      line: {
        x1: xForSmallBoxLine + 20,
        y1: y + box.height + lineHeight * 2 + 7,
        x2: xForSmallBoxLine + 20,
        y2: y + box.height + lineHeight + 5,
        speed: 0.05,
        direction: 'up',
        text: `$${Math.floor(Math.random() * 10) + 1}`,
      },
    });
  }

  const mediumBoxes = ['runAuction()', 'Show Winning Ad'];

  _auction.bottomFlow = [];

  // Setup bottom blocks
  for (let i = 0; i < mediumBoxes.length; i++) {
    const title = mediumBoxes[i];
    const boxXPosition =
      x + box.width / 2 + mediumBox.width * i + lineWidth * (i + 1);
    const lineXPosition =
      boxXPosition - mediumBox.width + config.timeline.circleProps.diameter / 2;

    _auction.bottomFlow.push({
      name: title,
      box: {
        x: boxXPosition,
        y: y + box.height / 2 + mediumBox.height / 2,
        width: mediumBox.width,
        height: mediumBox.height,
      },
      line: {
        x1: lineXPosition,
        y1: y + box.height / 2 + mediumBox.height,
        x2: lineXPosition,
        y2: y + box.height / 2 + mediumBox.height,
        speed: 0.06,
        direction: 'right',
      },
    });
  }

  app.auction.auctions.push(_auction);
};

auction.draw = async (index) => {
  app.p.textAlign(app.p.CENTER, app.p.CENTER);

  const _auction = app.auction.auctions[index];

  if (!_auction) {
    return;
  }

  // Helper function to draw lines and boxes
  const drawLineAndBox = async (item) => {
    await drawLine(item);
    drawBox(item);
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

  // Draw SSP box and line
  await drawLineAndBox(_auction.ssp);
  await utils.delay(500);

  rippleEffect.setUp();
  await rippleEffect.start(
    _auction.ssp.box.x + config.flow.box.width / 2,
    _auction.ssp.box.y + config.flow.box.height + 2
  );

  // Sequentially draw DSP boxes and lines
  const dsp = _auction.dsp;
  await Promise.all(dsp.map((dspItem) => drawBox(dspItem)));

  await utils.delay(1000);

  for (const dspItem of dsp) {
    // eslint-disable-next-line no-await-in-loop
    await drawLine(dspItem); // Sequential execution for DSP items
    // eslint-disable-next-line no-await-in-loop
    await utils.delay(1000);
  }

  // Sequentially draw bottom flow boxes and lines
  const bottomFlow = _auction.bottomFlow;
  for (const flowItem of bottomFlow) {
    // eslint-disable-next-line no-await-in-loop
    await drawLineAndBox(flowItem); // Sequential execution for bottom flow
    if (flowItem.name === 'runAuction()') {
      // eslint-disable-next-line no-await-in-loop
      await flow.barrageAnimation(index);
    }
    // eslint-disable-next-line no-await-in-loop
    await utils.delay(1000);
  }

  utils.delay(1000);
  auction.remove(index);
};

auction.remove = (index) => {
  const { ssp, dsp, bottomFlow } = app.auction.auctions[index];
  const x1 = dsp[0]?.box?.x - 10;
  const y1 = ssp.line.y1;
  const x2 = bottomFlow[1]?.box?.x + config.flow.mediumBox.width;

  const height =
    config.flow.box.height +
    config.flow.smallBox.height +
    config.flow.lineWidth +
    config.timeline.circleProps.diameter;
  600;

  flow.createOverrideBox(x1, y1, x2, height);
};

export default auction;
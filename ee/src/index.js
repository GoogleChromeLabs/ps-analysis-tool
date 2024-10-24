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
import config from './config.js';
import app from './app.js';
import auctions from './modules/auctions.js';
import flow from './modules/flow.js';
import utils from './modules/utils.js';
import timeline from './modules/timeline.js';
import joinInterestGroup from './modules/join-interest-group.js';
import icons from './icons.json';

app.init = (p) => {
  app.p = p;
  app.auction = { ...app.auction, ...auctions };
  app.flow = { ...app.flow, ...flow };
  app.utils = { ...app.utils, ...utils };
  app.timeline = { ...app.timeline, ...timeline };
  app.joinInterestGroup = { ...app.joinInterestGroup, ...joinInterestGroup };

  app.handlePlayPauseButttons();

  timeline.init();

  app.auction.setupAuctions();
  app.joinInterestGroup.setupJoinings();

  app.play();
};

app.interestGroupInit = (p) => {
  app.ip = p;
  app.auction = { ...app.auction, ...auctions };
  app.flow = { ...app.flow, ...flow };
  app.utils = { ...app.utils, ...utils };
  app.timeline = { ...app.timeline, ...timeline };
  app.joinInterestGroup = { ...app.joinInterestGroup, ...joinInterestGroup };

  app.handlePlayPauseButttons();
};

app.play = () => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.timeline.isPaused = false;
  app.setupLoop();
};

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.timeline.isPaused = true;
};

app.setupLoop = async () => {
  while (
    !app.timeline.isPaused &&
    app.timeline.currentIndex < config.timeline.circles.length
  ) {
    app.timeline.renderUserIcon();
    // eslint-disable-next-line no-await-in-loop
    await app.drawFlows(app.timeline.currentIndex);
    app.timeline.currentIndex++;
  }
  app.timeline.eraseAndRedraw();
};

app.drawFlows = async (index) => {
  await app.joinInterestGroup.draw(index);
  await app.auction.draw(index);
};

app.handlePlayPauseButttons = () => {
  app.playButton = document.getElementById('play');
  app.pauseButton = document.getElementById('pause');

  app.playButton.addEventListener('click', app.play);
  app.pauseButton.addEventListener('click', app.pause);
};

// Define the sketch
const sketch = (p) => {
  p.setup = () => {
    const { height, width } = calculateHeightAndWidth();
    const canvas = p.createCanvas(width, height);
    canvas.parent('ps-canvas');
    canvas.style('z-index', 0);
    p.background(config.canvas.background);
    p.textSize(config.canvas.fontSize);

    (async () => {
      await app.init(p);
    })();
  };

  p.preload = () => {
    p.userIcon = p.loadImage(icons.user);
    p.playIcon = p.loadImage(icons.play);
    p.pauseIcon = p.loadImage(icons.pause);
    p.completedCheckMark = p.loadImage(icons.completedCheckMark);
  };
};

// Define the sketch
const interestGroupSketch = (p) => {
  p.setup = () => {
    const { height, width } = calculateHeightAndWidth();
    const overlayCanvas = p.createCanvas(width, height);
    overlayCanvas.parent('overlay-canvas');
    overlayCanvas.style('z-index', 1);
    p.textSize(config.canvas.fontSize);

    (async () => {
      await app.interestGroupInit(p);
    })();
  };

  p.preload = () => {
    p.userIcon = p.loadImage(icons.user);
    p.playIcon = p.loadImage(icons.play);
    p.pauseIcon = p.loadImage(icons.pause);
    p.completedCheckMark = p.loadImage(icons.completedCheckMark);
  };
};

const calculateHeightAndWidth = () => {
  const circleSpace =
    config.timeline.circleProps.verticalSpacing +
    config.timeline.circleProps.diameter;
  const rippleRadius =
    config.rippleEffect.maxRadius * 2 +
    (config.rippleEffect.numRipples - 1) * 40;
  const maxHeightUsingBoxAndLine =
    config.flow.lineWidth * 2 +
    config.flow.box.height +
    config.flow.smallBox.height;
  const height =
    config.timeline.position.y +
    circleSpace +
    (rippleRadius > maxHeightUsingBoxAndLine
      ? rippleRadius
      : maxHeightUsingBoxAndLine);

  const auctionBoxesWidth =
    config.flow.box.width +
    config.flow.mediumBox.width * 2 +
    config.flow.lineWidth * 2;
  const interestGroupWidth = config.flow.box.width;
  let maxXposition =
    config.timeline.position.x + circleSpace * config.timeline.circles.length;

  config.timeline.circles.forEach((circle, index) => {
    const xPos = config.timeline.position.x + circleSpace * index;

    if (circle.type === 'publisher') {
      maxXposition = Math.max(maxXposition, xPos + auctionBoxesWidth);
    } else {
      maxXposition = Math.max(maxXposition, xPos + interestGroupWidth);
    }
  });

  return {
    height,
    width: maxXposition,
  };
};

// eslint-disable-next-line no-new
new p5(sketch);

// eslint-disable-next-line no-new
new p5(interestGroupSketch);

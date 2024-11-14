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
import utils from './lib/utils.js';
import timeline from './modules/timeline.js';
import joinInterestGroup from './modules/join-interest-group.js';
import icons from './icons.json';
import bubbles from './lib/bubbles.js';

app.init = (p) => {
  app.p = p;
  app.setup();

  app.handleControls();

  timeline.init();

  app.auction.setupAuctions();
  app.joinInterestGroup.setupJoinings();
  if (!config.isInteractiveMode) {
    app.play();
  }
};

app.setup = () => {
  app.auction = { ...app.auction, ...auctions };
  app.flow = { ...app.flow, ...flow };
  app.utils = { ...app.utils, ...utils };
  app.timeline = { ...app.timeline, ...timeline };
  app.joinInterestGroup = { ...app.joinInterestGroup, ...joinInterestGroup };
  app.bubbles = { ...app.bubbles, ...bubbles };
};

app.interestGroupInit = (p) => {
  app.igp = p;
  app.setup();
};

app.userInit = (p) => {
  app.up = p;
  app.setup();
};

app.play = () => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.timeline.isPaused = false;
  if (config.bubbles.isExpanded) {
    config.bubbles.isExpanded = false;
    utils.wipeAndRecreateInterestCanvas();
    bubbles.generateBubbles(true);
    bubbles.showMinifiedBubbles();
  }
  app.setupLoop();
};
app.minifiedBubbleClickListener = () => {
  if (!config.bubbles.isExpanded) {
    config.bubbles.isExpanded = true;
    bubbles.showExpandedBubbles();
    app.pause();
  }
};

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.timeline.isPaused = true;
  if (config.bubbles.isExpanded) {
    bubbles.showExpandedBubbles();
    bubbles.generateBubbles(true);
  }
};

app.setupLoop = async () => {
  while (
    !app.timeline.isPaused &&
    app.timeline.currentIndex < config.timeline.circles.length
  ) {
    bubbles.showMinifiedBubbles();
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

app.handleControls = () => {
  app.playButton = document.getElementById('play');
  app.pauseButton = document.getElementById('pause');

  document.getElementById('close-button').addEventListener('click', app.play);
  app.multSellerCheckBox = document.getElementById('multi-seller');

  app.playButton.addEventListener('click', app.play);
  app.pauseButton.addEventListener('click', app.pause);
  app.multSellerCheckBox.addEventListener('change', app.toggleMultSeller);
};

// Write a callback function to get the value of the checkbox.
app.toggleMultSeller = (event) => {
  app.isMultiSeller = event.target.checked;
};

app.calculateCanvasDimensions = () => {
  const {
    timeline: {
      circleProps: { verticalSpacing, diameter },
      position: { x: timelineX, y: timelineY },
      circles,
    },
    rippleEffect: { maxRadius, numRipples },
    flow: {
      lineWidth,
      box: { height: boxHeight, width: boxWidth },
      smallBox: { height: smallBoxHeight },
      mediumBox: { width: mediumBoxWidth },
    },
  } = config;

  const circleSpace = verticalSpacing + diameter;
  const rippleRadius = maxRadius * 2 + (numRipples - 1) * 40;
  const maxHeightUsingBoxAndLine = lineWidth * 2 + boxHeight + smallBoxHeight;
  const height =
    timelineY +
    circleSpace +
    Math.max(rippleRadius, maxHeightUsingBoxAndLine) +
    700; // @todo: 700 is a magic number and needs to be calculated based on the content.

  const auctionBoxesWidth = boxWidth + mediumBoxWidth * 2 + lineWidth * 2;
  const interestGroupWidth = boxWidth;
  let maxXposition = timelineX + circleSpace * circles.length;

  circles.forEach((circle, index) => {
    const xPos = timelineX + circleSpace * index;
    maxXposition = Math.max(
      maxXposition,
      xPos +
        (circle.type === 'publisher' ? auctionBoxesWidth : interestGroupWidth)
    );
  });
  config.canvas.width = maxXposition;
  config.canvas.height = height;
  return {
    height,
    width: maxXposition,
  };
};

// Define the sketch
const sketch = (p) => {
  p.setup = () => {
    const { height, width } = app.calculateCanvasDimensions();
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
    p.expandIcon = p.loadImage(icons.expand);

    p.completedCheckMark = p.loadImage(icons.completedCheckMark);
  };
};

// Define the sketch
const interestGroupSketch = (p) => {
  p.setup = () => {
    const { height, width } = app.calculateCanvasDimensions();
    const overlayCanvas = p.createCanvas(width, height);

    overlayCanvas.parent('interest-canvas');
    overlayCanvas.style('z-index', 2);
    p.textSize(config.canvas.fontSize);
    app.igpCanvas = overlayCanvas;

    config.bubbles.minifiedBubbleX = 60;
    config.bubbles.minifiedBubbleY = height - 50;

    app.minifiedBubbleContainer = document.getElementById(
      'minified-bubble-container'
    );

    document.styleSheets[0].cssRules.forEach((rules, index) => {
      if (rules.selectorText === '.minified-bubble-container.expanded') {
        document.styleSheets[0].cssRules[index].style.left = `${
          config.canvas.width / 4
        }px`;

        document.getElementById('close-button').style.left = `${
          config.canvas.width - 100
        }px`;

        document.styleSheets[0].cssRules[index].style.width = `640px`;
        document.styleSheets[0].cssRules[index].style.height = `640px`;
      }

      if (rules.selectorText === '.minified-bubble-container') {
        document.styleSheets[0].cssRules[
          index
        ].style.top = `${config.bubbles.minifiedBubbleY}px`;
      }
    });

    app.countDisplay = document.getElementById('count-display');

    app.minifiedBubbleContainer.addEventListener(
      'click',
      app.minifiedBubbleClickListener
    );
    app.minifiedBubbleContainer.style.zIndex = 3;

    (async () => {
      await app.interestGroupInit(p);
    })();
  };
};

// Define the sketch
const userSketch = (p) => {
  p.setup = () => {
    const { height, width } = app.calculateCanvasDimensions();
    const overlayCanvas = p.createCanvas(width, height);

    overlayCanvas.parent('user-canvas');
    overlayCanvas.style('z-index', 1);
    p.textSize(config.canvas.fontSize);

    (async () => {
      await app.userInit(p);
    })();
  };
};

// eslint-disable-next-line no-new
new p5(sketch);

// eslint-disable-next-line no-new
new p5(interestGroupSketch);

// eslint-disable-next-line no-new
new p5(userSketch);

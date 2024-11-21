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
import bubbles from './modules/bubbles.js';

app.setUpTimeLine = () => {
  if (config.isInteractiveMode) {
    app.auction.auctions = [];
    app.joinInterestGroup.joinings = [];
    app.timeline.circlePositions = [];
    app.timeline.circlePublisherIndices = [];
    app.bubbles.positions = [];
    app.bubbles.minifiedSVG = null;
    app.timeline.currentIndex = 0;
  }
  bubbles.clearAndRewriteBubbles();
  app.setup();

  timeline.init();

  app.auction.setupAuctions();
  app.joinInterestGroup.setupJoinings();
};
app.init = async (p) => {
  app.p = p;

  app.setUpTimeLine();

  if (!config.isInteractiveMode) {
    await app.play();
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
};

app.userInit = (p) => {
  app.up = p;
};

app.play = async (resumed = false) => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.timeline.isPaused = false;
  if (!resumed) {
    await app.setupLoop();
  }
};

app.pause = () => {
  app.pauseButton.classList.add('hidden');
  app.playButton.classList.remove('hidden');
  app.timeline.isPaused = true;
};

app.minimiseBubbleActions = () => {
  bubbles.generateBubbles(true);
  config.bubbles.isExpanded = false;
  bubbles.showMinifiedBubbles();
  app.play(true);
};

app.expandBubbleActions = () => {
  config.bubbles.isExpanded = true;
  bubbles.showExpandedBubbles();
  bubbles.generateBubbles(true);
  app.pause();
};
app.minifiedBubbleClickListener = (event, expandOverride) => {
  const clickedInsideExpandedCircle = utils.isInsideCircle(
    config.bubbles.expandedBubbleX,
    config.bubbles.expandedBubbleY,
    event.x,
    event.y,
    config.bubbles.expandedCircleDiameter / 2
  );

  const clickedInsideMinifiedCircle = utils.isInsideCircle(
    config.bubbles.minifiedBubbleX,
    config.bubbles.minifiedBubbleY,
    event.x,
    event.y,
    config.bubbles.minifiedCircleDiameter / 2
  );

  if (
    (!config.bubbles.isExpanded && clickedInsideMinifiedCircle) ||
    expandOverride
  ) {
    app.expandBubbleActions();
    event.stopPropagation();
    return;
  }

  if (config.bubbles.isExpanded && !clickedInsideExpandedCircle) {
    app.minimiseBubbleActions();
    event.stopPropagation();
    return;
  }
};

app.setupLoop = async () => {
  if (window.cancelPromise) {
    window.cancelPromise = false;
  }

  while (
    app.timeline.currentIndex < config.timeline.circles.length &&
    !config.isInteractiveMode
  ) {
    if (window.cancelPromise) {
      if (config.isInteractiveMode) {
        return;
      }
      window.cancelPromise = false;
      continue;
    }

    if (app.timeline.isPaused) {
      continue;
    }

    config.timeline.circles[app.timeline.currentIndex].visited = true;

    bubbles.showMinifiedBubbles();
    app.timeline.renderUserIcon();
    // eslint-disable-next-line no-await-in-loop
    await app.drawFlows(app.timeline.currentIndex);

    if (!window.cancelPromise && !config.isInteractiveMode) {
      app.timeline.currentIndex++;
    }

    if (app.timeline.currentIndex > 0) {
      app.prevButton.disabled = false;
    }
    if (app.timeline.currentIndex === config.timeline.circles.length) {
      app.nextButton.disabled = true;
    }
  }
  app.timeline.eraseAndRedraw();
};

app.drawFlows = async (index) => {
  await app.joinInterestGroup.draw(index);
  await app.auction.draw(index);
};

app.minifiedBubbleKeyPressListener = (event) => {
  if (event.key === 'Escape' && config.bubbles.isExpanded) {
    app.minimiseBubbleActions();
  }
};

app.handlePrevButton = () => {
  if (config.bubbles.isExpanded) {
    return;
  }
  window.cancelPromise = true;
  app.timeline.currentIndex -= 1;
  flow.clearBelowTimelineCircles();
};

app.handleNextButton = () => {
  if (config.bubbles.isExpanded) {
    return;
  }
  window.cancelPromise = true;
  bubbles.generateBubbles();
  bubbles.showMinifiedBubbles();
  app.timeline.currentIndex += 1;
  config.bubbles.interestGroupCounts =
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex);
  flow.clearBelowTimelineCircles();
};

app.handleControls = () => {
  app.playButton = document.getElementById('play');
  app.pauseButton = document.getElementById('pause');
  app.multSellerCheckBox = document.getElementById('multi-seller');
  app.intreactiveModeCheckBox = document.getElementById('interactive-mode');
  app.bubbleContainerDiv = document.getElementById('bubble-container-div');
  app.closeButton = document.getElementById('close-button');
  app.openButton = document.getElementById('open-button');
  app.countDisplay = document.getElementById('count-display');
  app.minifiedBubbleContainer = document.getElementById(
    'minified-bubble-container'
  );
  app.nextButton = document.getElementById('next-div');
  app.prevButton = document.getElementById('previous-div');

  app.visitedSites = [];

  document.addEventListener('keyup', app.minifiedBubbleKeyPressListener);

  app.minifiedBubbleContainer.addEventListener(
    'click',
    app.minifiedBubbleClickListener
  );

  app.prevButton.addEventListener('click', app.handlePrevButton);
  app.nextButton.addEventListener('click', app.handleNextButton);

  app.bubbleContainerDiv.addEventListener(
    'click',
    app.minifiedBubbleClickListener
  );

  app.closeButton.addEventListener('click', app.minimiseBubbleActions);

  app.openButton.addEventListener('click', (event) =>
    app.minifiedBubbleClickListener(event, true)
  );

  app.playButton.addEventListener('click', () => {
    app.play(true);
  });
  app.pauseButton.addEventListener('click', app.pause);
  app.multSellerCheckBox.addEventListener('change', app.toggleMultSeller);
  app.intreactiveModeCheckBox.addEventListener(
    'change',
    app.toggleInteractiveMode
  );
};

app.toggleInteractiveMode = () => {
  window.cancelPromise = true;
  config.isInteractiveMode = !config.isInteractiveMode;
  app.timeline.currentIndex = 0;
  config.shouldRespondToClick = true;
  config.bubbles.interestGroupCounts = 0;
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;

  utils.setupInterestGroupCanvas(app.igp);
  utils.setupUserCanvas(app.up);
  utils.setupMainCanvas(app.p);

  config.timeline.circles = config.timeline.circles.map((circle) => {
    circle.visited = false;
    return circle;
  });

  app.timeline.eraseAndRedraw();
};

// Write a callback function to get the value of the checkbox.
app.toggleMultSeller = (event) => {
  app.isMultiSeller = event.target.checked;
};

// Define the sketch
const sketch = (p) => {
  p.setup = () => {
    utils.setupMainCanvas(p);
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
    utils.setupInterestGroupCanvas(p);
  };
};

// Define the sketch
const userSketch = (p) => {
  p.setup = () => {
    utils.setupUserCanvas(p);
  };
};

app.handleControls();
// eslint-disable-next-line no-new
new p5(sketch);

// eslint-disable-next-line no-new
new p5(interestGroupSketch);

// eslint-disable-next-line no-new
new p5(userSketch);

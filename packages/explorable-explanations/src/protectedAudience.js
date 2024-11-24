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
import config from './config.js';
import auctions from './modules/auctions.js';
import flow from './modules/flow.js';
import utils from './lib/utils.js';
import timeline from './modules/timeline.js';
import joinInterestGroup from './modules/join-interest-group.js';
import icons from './icons.json';
import bubbles from './modules/bubbles.js';

const app = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    smallCirclePositions: [],
    circlePublisherIndices: [],
    currentIndex: 0,
  },
  auction: {
    auctions: [],
    nextTipCoordinates: { x: 0, y: 0 },
  },
  joinInterestGroup: {
    joinings: [],
    nextTipCoordinates: { x: 0, y: 0 },
  },
  flow: {
    intervals: {},
  },
  bubbles: {
    positions: [],
    minifiedSVG: null,
    expandedSVG: null,
  },
  utils: {},
  p: null,
  igp: null,
  up: null,
  isMultiSeller: false,
};

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

  auctions.setupAuctions();
  joinInterestGroup.setupJoinings();
};

app.setup = () => {
  app.auction = { ...app.auction, ...auctions };
  app.flow = { ...app.flow, ...flow };
  app.utils = { ...app.utils, ...utils };
  app.timeline = { ...app.timeline, ...timeline };
  app.joinInterestGroup = { ...app.joinInterestGroup, ...joinInterestGroup };
  app.bubbles = { ...app.bubbles, ...bubbles };
};

app.play = (resumed = false) => {
  app.timeline.isPaused = false;
  if (!resumed) {
    app.setupLoop();
  }
};

app.pause = () => {
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

app.setupLoop = () => {
  if (window.cancelPromise) {
    window.cancelPromise = false;
  }

  const loop = async () => {
    if (
      window.cancelPromise ||
      app.timeline.currentIndex >= config.timeline.circles.length
    ) {
      return;
    }

    if (!app.timeline.isPaused) {
      window.cancelPromiseForPreviousAndNext = false;
      utils.disableButtons();

      utils.markVisitedValue(app.timeline.currentIndex, true);
      bubbles.showMinifiedBubbles();
      timeline.renderUserIcon();

      await app.drawFlows(app.timeline.currentIndex);

      if (!window.cancelPromiseForPreviousAndNext) {
        app.timeline.currentIndex++;
      }
    }

    requestAnimationFrame(loop);
    timeline.eraseAndRedraw();
    timeline.renderUserIcon();
  };

  requestAnimationFrame(loop);
};

app.drawFlows = async (index) => {
  await joinInterestGroup.draw(index);
  await auctions.draw(index);
};

app.minifiedBubbleKeyPressListener = (event) => {
  if (event.key === 'Escape' && config.bubbles.isExpanded) {
    app.minimiseBubbleActions();
  }
};

app.handlePrevButton = () => {
  if (config.bubbles.isExpanded || config.isInteractiveMode) {
    return;
  }

  window.cancelPromiseForPreviousAndNext = true;
  app.timeline.currentIndex -= 1;
  app.prevButton.disabled = app.timeline.currentIndex > 0 ? false : true;
  utils.markVisitedValue(app.timeline.currentIndex, true);
  const totalBubbles = bubbles.calculateTotalBubblesForAnimation(
    app.timeline.currentIndex
  );

  config.bubbles.interestGroupCounts = totalBubbles;
  flow.clearBelowTimelineCircles();
  timeline.drawTimelineLine();
  timeline.drawTimeline(config.timeline);
  utils.disableButtons();

  if (app.timeline.isPaused) {
    bubbles.generateBubbles();
    bubbles.showMinifiedBubbles();
  }
};

app.handleNextButton = () => {
  if (config.bubbles.isExpanded || config.isInteractiveMode) {
    return;
  }

  window.cancelPromiseForPreviousAndNext = true;

  app.timeline.currentIndex += 1;
  utils.markVisitedValue(app.timeline.currentIndex, true);
  flow.clearBelowTimelineCircles();
  timeline.drawTimelineLine();
  timeline.drawTimeline(config.timeline);
  config.bubbles.interestGroupCounts =
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex);
  utils.disableButtons();

  if (app.timeline.isPaused) {
    bubbles.generateBubbles();
    bubbles.showMinifiedBubbles();
  }
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

  if (config.isInteractiveMode) {
    app.prevButton.style.display = 'none';
    app.nextButton.style.display = 'none';
  } else {
    app.prevButton.style.display = 'block';
    app.nextButton.style.display = 'block';
  }

  utils.setupInterestGroupCanvas(app.igp);
  utils.setupUserCanvas(app.up);
  utils.setupMainCanvas(app.p);
  utils.markVisitedValue(config.timeline.circles.length, false);

  timeline.eraseAndRedraw();
};

// Write a callback function to get the value of the checkbox.
app.toggleMultSeller = (event) => {
  app.isMultiSeller = event.target.checked;
};

// Define the sketch
export const sketch = (p) => {
  app.handleControls();
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
export const interestGroupSketch = (p) => {
  p.setup = () => {
    utils.setupInterestGroupCanvas(p);
  };
};

// Define the sketch
export const userSketch = (p) => {
  p.setup = () => {
    utils.setupUserCanvas(p);
  };
};
export { app };

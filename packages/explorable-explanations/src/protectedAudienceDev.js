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
 * External dependencies
 */
import p5 from 'p5';
import * as d3 from 'd3';
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
import app from './app.js';
import PromiseQueue from './lib/PromiseQueue.js';

app.setUpTimeLine = () => {
  app.auction.auctions = [];
  app.joinInterestGroup.joinings = [];
  app.timeline.circlePositions = [];
  app.timeline.circlePublisherIndices = [];
  app.bubbles.positions = [];
  app.bubbles.minifiedSVG = null;
  app.timeline.currentIndex = 0;
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
  const groups = [];

  config.timeline.circles.forEach((circle) => {
    circle.interestGroups?.forEach(() => {
      groups.push(circle.website);
    });
  });

  app.color = d3.scaleOrdinal(groups, d3.schemeTableau10);
};

app.play = (resumed = false, doNotPlay = false) => {
  app.playButton.classList.add('hidden');
  app.pauseButton.classList.remove('hidden');
  app.timeline.isPaused = false;
  if (!resumed) {
    app.setupLoop(doNotPlay);
    return;
  }
  PromiseQueue.resume();
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
  const rect = app.minifiedBubbleContainer.getBoundingClientRect();

  const clickedInsideExpandedCircle = utils.isInsideCircle(
    rect.x + config.bubbles.expandedCircleDiameter / 2,
    rect.y + config.bubbles.expandedCircleDiameter / 2,
    event.x,
    event.y,
    config.bubbles.expandedCircleDiameter / 2
  );

  const clickedInsideMinifiedCircle = utils.isInsideCircle(
    rect.x + config.bubbles.minifiedCircleDiameter / 2,
    rect.y + config.bubbles.minifiedCircleDiameter / 2,
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

app.setupLoop = (doNotPlay) => {
  try {
    utils.setButtonsDisabilityState();
    let currentIndex = 0;
    PromiseQueue.nextNodeSkipIndex.push(0);
    while (currentIndex < config.timeline.circles.length) {
      PromiseQueue.add(() => {
        flow.clearBelowTimelineCircles();
        utils.markVisitedValue(app.timeline.currentIndex, true);
        bubbles.generateBubbles();
        bubbles.showMinifiedBubbles();
        timeline.eraseAndRedraw();
        timeline.renderUserIcon();
      });

      app.drawFlows(currentIndex);
      PromiseQueue.add(() => {
        config.bubbles.interestGroupCounts +=
          config.timeline.circles[app.timeline.currentIndex]?.igGroupsCount ??
          0;
      });
      PromiseQueue.nextNodeSkipIndex.push(PromiseQueue.queue.length);
      PromiseQueue.add(() => {
        app.timeline.currentIndex += 1;
        utils.setButtonsDisabilityState();
      });

      currentIndex++;
    }
  } catch (error) {
    //Silently fail.
    // eslint-disable-next-line no-console
    console.log(error);
  }
  timeline.eraseAndRedraw();
  timeline.renderUserIcon();
  utils.markVisitedValue(app.timeline.currentIndex, true);
  if (doNotPlay) {
    return;
  }
  PromiseQueue.start();
};

app.drawFlows = (index) => {
  joinInterestGroup.draw(index);
  auctions.draw(index);
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

  if (app.timeline.currentIndex <= 0) {
    return;
  }

  window.cancelPromise = true;
  app.timeline.isPaused = true;
  const nextIndexPromiseGetter = app.timeline.currentIndex - 1;
  app.timeline.currentIndex -= 1;
  app.prevButton.disabled = app.timeline.currentIndex > 0 ? false : true;
  utils.setButtonsDisabilityState();
  utils.disableButtons();

  const nextIndex = PromiseQueue.nextNodeSkipIndex[nextIndexPromiseGetter];

  PromiseQueue.skipTo(nextIndex + 1);

  utils.markVisitedValue(app.timeline.currentIndex, true);

  app.p.clear();
  app.p.background(config.canvas.background);

  timeline.drawTimelineLine();
  timeline.drawTimeline(config.timeline);
  app.up.clear();
  timeline.renderUserIcon();

  config.bubbles.interestGroupCounts =
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex);
  bubbles.showMinifiedBubbles();
};

app.handleNextButton = () => {
  if (config.bubbles.isExpanded || config.isInteractiveMode) {
    return;
  }

  if (app.timeline.currentIndex > config.timeline.circles.length - 1) {
    return;
  }

  app.timeline.isPaused = true;
  window.cancelPromise = true;
  app.timeline.currentIndex += 1;
  utils.setButtonsDisabilityState();
  utils.disableButtons();
  const nextIndexPromiseGetter = app.timeline.currentIndex;
  const nextIndex = PromiseQueue.nextNodeSkipIndex[nextIndexPromiseGetter];

  PromiseQueue.skipTo(nextIndex + 1);

  utils.markVisitedValue(app.timeline.currentIndex, true);

  app.p.clear();
  app.p.background(config.canvas.background);

  timeline.drawTimelineLine();
  timeline.drawTimeline(config.timeline);
  app.up.clear();
  timeline.renderUserIcon();

  config.bubbles.interestGroupCounts =
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex);
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

  app.prevButton.addEventListener('click', app.handlePrevButton);
  app.nextButton.addEventListener('click', app.handleNextButton);

  app.visitedSites = [];

  document.addEventListener('keyup', app.minifiedBubbleKeyPressListener);

  app.minifiedBubbleContainer.addEventListener(
    'click',
    app.minifiedBubbleClickListener
  );

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

app.toggleInteractiveMode = async () => {
  PromiseQueue.clear();
  window.cancelPromise = true;
  app.timeline.isPaused = true;

  config.isInteractiveMode = !config.isInteractiveMode;
  app.timeline.currentIndex = 0;
  config.bubbles.interestGroupCounts = 0;
  app.bubbles.positions = [];
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;
  config.shouldRespondToClick = true;
  config.startTrackingMouse = true;

  if (config.isInteractiveMode) {
    app.prevButton.style.disabled = false;
    app.nextButton.style.disabled = false;
  } else {
    app.prevButton.style.disabled = true;
    app.nextButton.style.disabled = false;
  }

  utils.markVisitedValue(config.timeline.circles.length, false);
  timeline.eraseAndRedraw();
  await utils.delay(100);
  utils.setupInterestGroupCanvas(app.igp);
  utils.setupUserCanvas(app.up);
  utils.setupMainCanvas(app.p, true);
  PromiseQueue.skipTo(0);
  if (config.isInteractiveMode) {
    return;
  }
  PromiseQueue.start();
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

app.reset = async () => {
  PromiseQueue.stop();
  window.cancelPromise = true;
  app.timeline.isPaused = true;
  PromiseQueue.clear();

  app.timeline.currentIndex = 0;
  config.bubbles.interestGroupCounts = 0;
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;
  app.bubbles.positions = [];

  utils.markVisitedValue(config.timeline.circles.length, false);
  timeline.eraseAndRedraw();
  await utils.delay(1000);
  utils.setupInterestGroupCanvas(app.igp);
  utils.setupUserCanvas(app.up);
  utils.setupMainCanvas(app.p);

  app.timeline.isPaused = true;
  window.cancelPromise = false;
  PromiseQueue.skipTo(0);

  app.timeline.isPaused = false;
  config.shouldRespondToClick = true;
  config.startTrackingMouse = true;
};

app.handleControls();
// eslint-disable-next-line no-new
new p5(sketch);

// eslint-disable-next-line no-new
new p5(interestGroupSketch);
// eslint-disable-next-line no-new
new p5(userSketch);

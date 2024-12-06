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
import config from './config';
import auctions from './modules/auctions';
import flow from './modules/flow';
import * as utils from './utils';
import timeline from './modules/timeline';
import joinInterestGroup from './modules/joinInterestGroup';
import icons from '../icons.json';
import bubbles from './modules/bubbles';
import app from './app';
import promiseQueue from './lib/promiseQueue';
import {
  setupInterestGroupCanvas,
  setupMainCanvas,
  setupUserCanvas,
} from './canvas';

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
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.playButton.classList.add('hidden');
    app.pauseButton.classList.remove('hidden');
  }

  app.timeline.isPaused = false;
  if (!resumed) {
    app.setupLoop(doNotPlay);
    return;
  }
  promiseQueue.resume();
};

app.pause = () => {
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.pauseButton.classList.add('hidden');
    app.playButton.classList.remove('hidden');
  }
  app.timeline.isPaused = true;
};

app.minimiseBubbleActions = () => {
  bubbles.generateBubbles(true);
  app.bubbles.isExpanded = false;
  bubbles.showMinifiedBubbles();
  app.play(true);
};

app.expandBubbleActions = () => {
  app.bubbles.isExpanded = true;
  bubbles.showExpandedBubbles();
  bubbles.generateBubbles(true);
  app.pause();
};
app.minifiedBubbleClickListener = (event, expandOverride) => {
  const rect = app.minifiedBubbleContainer.getBoundingClientRect();

  const clickedInsideExpandedCircle = utils.isInsideCircle(
    rect.x + app.bubbles.expandedCircleDiameter / 2,
    rect.y + app.bubbles.expandedCircleDiameter / 2,
    event.x,
    event.y,
    app.bubbles.expandedCircleDiameter / 2
  );

  const clickedInsideMinifiedCircle = utils.isInsideCircle(
    rect.x + app.bubbles.minifiedCircleDiameter / 2,
    rect.y + app.bubbles.minifiedCircleDiameter / 2,
    event.x,
    event.y,
    app.bubbles.minifiedCircleDiameter / 2
  );

  if (
    (!app.bubbles.isExpanded && clickedInsideMinifiedCircle) ||
    expandOverride
  ) {
    app.expandBubbleActions();
    event.stopPropagation();
    return;
  }

  if (app.bubbles.isExpanded && !clickedInsideExpandedCircle) {
    app.minimiseBubbleActions();
    event.stopPropagation();
    return;
  }
};

app.setupLoop = (doNotPlay) => {
  try {
    flow.setButtonsDisabilityState();
    let currentIndex = 0;
    promiseQueue.nextNodeSkipIndex.push(0);
    while (currentIndex < config.timeline.circles.length) {
      promiseQueue.add(() => {
        flow.clearBelowTimelineCircles();
        utils.markVisitedValue(app.timeline.currentIndex, true);
        bubbles.generateBubbles();
        bubbles.showMinifiedBubbles();
        timeline.eraseAndRedraw();
        timeline.renderUserIcon();
      });

      app.drawFlows(currentIndex);
      promiseQueue.add(() => {
        app.bubbles.interestGroupCounts +=
          config.timeline.circles[app.timeline.currentIndex]?.igGroupsCount ??
          0;
      });
      promiseQueue.nextNodeSkipIndex.push(promiseQueue.queue.length);
      promiseQueue.add(() => {
        app.timeline.currentIndex += 1;
        flow.setButtonsDisabilityState();
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

  promiseQueue.start();
};

app.drawFlows = (index) => {
  joinInterestGroup.draw(index);
  auctions.draw(index);
};

app.minifiedBubbleKeyPressListener = (event) => {
  if (event.key === 'Escape' && app.bubbles.isExpanded) {
    app.minimiseBubbleActions();
  }
};

app.handleNonInteractivePrev = () => {
  if (app.timeline.currentIndex <= 0) {
    return;
  }

  app.cancelPromise = true;
  app.timeline.isPaused = true;
  const nextIndexPromiseGetter = app.timeline.currentIndex - 1;
  app.timeline.currentIndex -= 1;
  flow.setButtonsDisabilityState();

  const nextIndex = promiseQueue.nextNodeSkipIndex[nextIndexPromiseGetter];

  promiseQueue.skipTo(nextIndex + 1);

  utils.markVisitedValue(app.timeline.currentIndex, true);

  utils.wipeAndRecreateMainCanvas();
  app.up.clear();
  timeline.renderUserIcon();

  app.bubbles.interestGroupCounts = bubbles.calculateTotalBubblesForAnimation(
    app.timeline.currentIndex
  );
};

app.handleInteractivePrev = () => {
  if (app.visitedIndexOrder.length === 0 || app.visitedIndexOrderTracker < 0) {
    return;
  }

  promiseQueue.clear();
  flow.setButtonsDisabilityState();
  app.shouldRespondToClick = false;

  const visitedIndex = app.visitedIndexOrder[app.visitedIndexOrderTracker];

  config.timeline.circles[visitedIndex].visited = false;

  app.isRevisitingNodeInInteractiveMode = true;
  app.timeline.currentIndex = visitedIndex;

  app.drawFlows(visitedIndex);

  promiseQueue.add(() => {
    app.shouldRespondToClick = true;
    app.isRevisitingNodeInInteractiveMode = false;
    config.timeline.circles[visitedIndex].visited = true;
    bubbles.showMinifiedBubbles();
    timeline.renderUserIcon();
  });

  if (app.visitedIndexOrderTracker >= 0) {
    app.visitedIndexOrderTracker--;
  }

  flow.setButtonsDisabilityState();

  utils.wipeAndRecreateMainCanvas();
  app.up.clear();
  timeline.renderUserIcon();
  promiseQueue.skipTo(0);
  promiseQueue.start();
};

app.handlePrevButton = () => {
  if (app.bubbles.isExpanded) {
    return;
  }

  if (app.isInteractiveMode) {
    app.handleInteractivePrev();
    return;
  }

  app.handleNonInteractivePrev();
};

app.handleNextButton = () => {
  if (app.bubbles.isExpanded) {
    return;
  }

  if (app.isInteractiveMode) {
    app.handleInteravtiveNext();
    return;
  }

  app.handleNonInteravtiveNext();
};

app.handleNonInteravtiveNext = () => {
  if (
    app.bubbles.isExpanded ||
    app.timeline.currentIndex > config.timeline.circles.length - 1
  ) {
    return;
  }

  app.timeline.isPaused = true;
  app.cancelPromise = true;
  app.timeline.currentIndex += 1;
  flow.setButtonsDisabilityState();

  const nextIndexPromiseGetter = app.timeline.currentIndex;
  const nextIndex = promiseQueue.nextNodeSkipIndex[nextIndexPromiseGetter];

  promiseQueue.skipTo(nextIndex + 1);

  utils.markVisitedValue(app.timeline.currentIndex, true);

  utils.wipeAndRecreateMainCanvas();
  app.up.clear();
  timeline.renderUserIcon();

  app.bubbles.interestGroupCounts = bubbles.calculateTotalBubblesForAnimation(
    app.timeline.currentIndex
  );
};

app.handleInteravtiveNext = () => {
  if (
    app.visitedIndexOrder.length === 0 ||
    app.visitedIndexOrderTracker === app.visitedIndexOrder.length
  ) {
    return;
  }

  if (app.visitedIndexOrderTracker < app.visitedIndexOrder.length) {
    if (app.visitedIndexOrderTracker < 0) {
      app.visitedIndexOrderTracker += 2;
    } else {
      app.visitedIndexOrderTracker++;
    }
  }

  promiseQueue.clear();
  flow.setButtonsDisabilityState();
  app.shouldRespondToClick = false;

  const visitedIndex = app.visitedIndexOrder[app.visitedIndexOrderTracker];

  config.timeline.circles[visitedIndex].visited = false;

  app.isRevisitingNodeInInteractiveMode = true;
  app.timeline.currentIndex = visitedIndex;

  app.drawFlows(visitedIndex);

  promiseQueue.add(() => {
    app.shouldRespondToClick = true;
    app.isRevisitingNodeInInteractiveMode = false;
    config.timeline.circles[visitedIndex].visited = true;
    bubbles.showMinifiedBubbles();
    timeline.renderUserIcon();
  });

  flow.setButtonsDisabilityState();

  utils.wipeAndRecreateMainCanvas();
  app.up.clear();
  timeline.renderUserIcon();
  promiseQueue.skipTo(0);
  promiseQueue.start();
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

  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.nextButton = document.getElementById('next-div');
    app.prevButton = document.getElementById('previous-div');
    app.prevButton.addEventListener('click', app.handlePrevButton);
    app.nextButton.addEventListener('click', app.handleNextButton);
    app.playButton.addEventListener('click', () => {
      app.play(true);
    });
    app.pauseButton.addEventListener('click', app.pause);
    app.multSellerCheckBox.addEventListener('change', app.toggleMultSeller);
    app.intreactiveModeCheckBox.addEventListener(
      'change',
      app.toggleInteractiveMode
    );
  }

  const minifiedBubbleContainerRect =
    app.minifiedBubbleContainer.getBoundingClientRect();

  app.bubbles.minifiedBubbleX = Math.floor(minifiedBubbleContainerRect.x);
  app.bubbles.minifiedBubbleY = Math.floor(minifiedBubbleContainerRect.y);

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
};

app.toggleInteractiveMode = async () => {
  promiseQueue.clear();
  promiseQueue.stop();
  app.cancelPromise = true;
  app.timeline.isPaused = true;

  app.isInteractiveMode = !app.isInteractiveMode;
  app.timeline.currentIndex = 0;
  app.bubbles.interestGroupCounts = 0;
  app.bubbles.positions = [];
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;
  app.shouldRespondToClick = true;
  app.startTrackingMouse = true;

  utils.markVisitedValue(config.timeline.circles.length, false);
  timeline.eraseAndRedraw();
  await utils.delay(100);

  setupInterestGroupCanvas(app.igp);
  setupUserCanvas(app.up);
  setupMainCanvas(app.p, true);

  promiseQueue.skipTo(0);

  if (app.isInteractiveMode) {
    flow.setButtonsDisabilityState();
    return;
  }

  promiseQueue.start();
};

// Write a callback function to get the value of the checkbox.
app.toggleMultSeller = (event) => {
  app.isMultiSeller = event.target.checked;
};

// Define the sketch
export const sketch = (p) => {
  app.handleControls();
  p.setup = () => {
    setupMainCanvas(p);
  };

  p.preload = () => {
    p.userIcon = p.loadImage(icons.user);
    p.playIcon = p.loadImage(icons.play);
    p.pauseIcon = p.loadImage(icons.pause);
    p.expandIcon = p.loadImage(icons.expand);
    p.infoIcon = p.loadImage(icons.info);

    p.completedCheckMark = p.loadImage(icons.completedCheckMark);
  };
};

// Define the sketch
export const interestGroupSketch = (p) => {
  p.setup = () => {
    setupInterestGroupCanvas(p);
  };

  p.updateWithProps = (props) => {
    if (props.onClick) {
      app.igp.igClick = props.onClick;
      app.bubbles.expandedBubbleX = props.expandedBubbleX;
      app.bubbles.expandedBubbleY = props.expandedBubbleY;
      app.bubbles.expandedCircleDiameter = props.expandedBubbleWidth;
      const radius = app.bubbles.expandedCircleDiameter / 2;
      const totalRadius = radius + 24;
      // 335 is the angle where the close icon should be visible.
      const angle = (305 * Math.PI) / 180;
      // 335 is the radius + the size of icon so that icon is attached to the circle.
      const x =
        totalRadius * Math.cos(angle) + app.bubbles.expandedBubbleX + radius;
      const y =
        totalRadius * Math.sin(angle) + app.bubbles.expandedBubbleY + radius;

      app.closeButton.style.left = `${x}px`;
      app.closeButton.style.top = `${y}px`;
      const expandedSVG = document.getElementById('expandedSVG');

      if (expandedSVG) {
        bubbles.showExpandedBubbles();
      }
    }
  };
};

// Define the sketch
export const userSketch = (p) => {
  p.setup = () => {
    setupUserCanvas(p);
  };
};

app.reset = async () => {
  promiseQueue.stop();
  app.cancelPromise = true;
  app.timeline.isPaused = true;
  promiseQueue.clear();

  app.timeline.currentIndex = 0;
  app.bubbles.interestGroupCounts = 0;
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;
  app.bubbles.positions = [];

  utils.markVisitedValue(config.timeline.circles.length, false);
  timeline.eraseAndRedraw();
  await utils.delay(1000);
  setupInterestGroupCanvas(app.igp);
  setupUserCanvas(app.up);
  setupMainCanvas(app.p);

  app.timeline.isPaused = true;
  app.cancelPromise = false;
  promiseQueue.skipTo(0);

  app.timeline.isPaused = false;
  app.shouldRespondToClick = true;
  app.startTrackingMouse = true;
};

app.createCanvas = () => {
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.handleControls();
    // eslint-disable-next-line no-new
    new p5(sketch);

    // eslint-disable-next-line no-new
    new p5(interestGroupSketch);
    // eslint-disable-next-line no-new
    new p5(userSketch);
  }
};
app.createCanvas();

export { app };

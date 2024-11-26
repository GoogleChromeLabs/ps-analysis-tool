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
import app from './app.js';

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

app.setupLoop = () => {
  try {
    utils.setButtonsDisabilityState();

    const loop = async () => {
      if (
        window.cancelPromise ||
        app.timeline.currentIndex >= config.timeline.circles.length ||
        config.isInteractiveMode
      ) {
        if (config.isReset) {
          app.timeline.currentIndex = 0;
          config.isReset = false;
          config.startTrackingMouse = true;
          window.cancelPromise = null;
          return;
        }

        if (app.timeline.currentIndex >= config.timeline.circles.length) {
          bubbles.showMinifiedBubbles();
          window.cancelPromise = null;
          config.isReset = false;
          return;
        }

        if (!config.isInteractiveMode) {
          app.timeline.currentIndex = 0;
          requestAnimationFrame(loop);
          timeline.eraseAndRedraw();
          timeline.renderUserIcon();
        } else {
          requestAnimationFrame(loop);
        }
        return;
      }

      if (
        !app.timeline.isPaused &&
        !config.isInteractiveMode &&
        !config.isReset
      ) {
        window.cancelPromiseForPreviousAndNext = false;

        utils.markVisitedValue(app.timeline.currentIndex, true);
        bubbles.showMinifiedBubbles();
        timeline.renderUserIcon();
        await app.drawFlows(app.timeline.currentIndex);

        if (!window.cancelPromiseForPreviousAndNext) {
          app.timeline.currentIndex++;
          utils.setButtonsDisabilityState();
        }
      }

      if (config.isReset) {
        app.timeline.currentIndex = 0;
        config.isReset = false;
        config.startTrackingMouse = true;
        window.cancelPromise = null;
        return;
      }

      requestAnimationFrame(loop);
      if (!config.isInteractiveMode) {
        config.startTrackingMouse = true;
        timeline.eraseAndRedraw();
        timeline.renderUserIcon();
      }
    };

    requestAnimationFrame(loop);
  } catch (error) {
    //Silently fail.
  }
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
  utils.markVisitedValue(app.timeline.currentIndex, true);
  const totalBubbles = bubbles.calculateTotalBubblesForAnimation(
    app.timeline.currentIndex
  );

  utils.setButtonsDisabilityState();

  config.bubbles.interestGroupCounts = totalBubbles;
  flow.clearBelowTimelineCircles();
  timeline.drawTimelineLine();
  timeline.drawTimeline(config.timeline);

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

  utils.setButtonsDisabilityState();

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

  const minifiedBubbleContainerRect =
    app.minifiedBubbleContainer.getBoundingClientRect();

  config.bubbles.minifiedBubbleX = Math.floor(minifiedBubbleContainerRect.x);
  config.bubbles.minifiedBubbleY = Math.floor(minifiedBubbleContainerRect.y);

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

app.toggleInteractiveMode = () => {
  window.cancelPromise = true;
  if (config.shouldRespondToClick === true && config.isInteractiveMode) {
    window.cancelPromise = false;
  } else {
    config.startTrackingMouse = true;
    config.shouldRespondToClick = true;
  }
  config.isInteractiveMode = !config.isInteractiveMode;
  app.timeline.currentIndex = 0;
  config.bubbles.interestGroupCounts = 0;
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;

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

  p.updateWithProps = (props) => {
    if (props.onClick) {
      app.igp.igClick = props.onClick;
      config.bubbles.expandedBubbleX = props.expandedBubbleX;
      config.bubbles.expandedBubbleY = props.expandedBubbleY;
      config.bubbles.expandedCircleDiameter = props.expandedBubbleWidth;
      const radius = config.bubbles.expandedCircleDiameter / 2;
      const totalRadius = radius + 24;
      // 335 is the angle where the close icon should be visible.
      const angle = (305 * Math.PI) / 180;
      // 335 is the radius + the size of icon so that icon is attached to the circle.
      const x =
        totalRadius * Math.cos(angle) + config.bubbles.expandedBubbleX + radius;
      const y =
        totalRadius * Math.sin(angle) + config.bubbles.expandedBubbleY + radius;

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
    utils.setupUserCanvas(p);
  };
};

app.reset = () => {
  window.cancelPromise = true;
  config.isReset = true;
  app.timeline.currentIndex = 0;
  config.bubbles.interestGroupCounts = 0;
  app.bubbles.minifiedSVG = null;
  app.bubbles.expandedSVG = null;

  utils.setupInterestGroupCanvas(app.igp);
  utils.setupUserCanvas(app.up);
  utils.setupMainCanvas(app.p);
  utils.markVisitedValue(config.timeline.circles.length, false);

  timeline.eraseAndRedraw();
};
export { app };

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
import Queue from 'queue';

/**
 * Internal dependencies.
 */
import config, { publisherData } from './config';
import auctions from './modules/auctions';
import flow from './modules/flow';
import * as utils from './utils';
import timeline from './modules/timeline';
import joinInterestGroup from './modules/joinInterestGroup';
import icons from '../icons.json';
import bubbles from './modules/bubbles';
import app from './app';
import {
  setupInterestGroupCanvas,
  setupMainCanvas,
  setupUserCanvas,
} from './canvas';
import type { P5, Circle } from './types.ts';
import { getCoordinateValues } from './utils/getCoordinateValues.ts';
app.setUpTimeLine = () => {
  app.auction.auctions = [];
  app.joinInterestGroup.joinings = [];
  app.timeline.circlePositions = [];
  app.timeline.circlePublisherIndices = [];
  app.bubbles.positions = [];
  app.bubbles.minifiedSVG = null;
  app.timeline.currentIndex = 0;
  app.timeline.expandIconPositions = [];
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
  const groups: string[] = [];

  config.timeline.circles.forEach((circle: Circle) => {
    circle.interestGroups?.forEach(() => {
      groups.push(circle.website);
    });
  });

  app.color = d3.scaleOrdinal(groups, d3.schemeTableau10);
};

app.play = (resumed = false, doNotPlay = false) => {
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.playButton?.classList.add('hidden');
    app.pauseButton?.classList.remove('hidden');
  }

  if (app.bubbles.isExpanded) {
    app.minimiseBubbleActions();
  }

  app.timeline.isPaused = false;
  app.timeline.pausedReason = '';

  if (!resumed) {
    app.setupLoop(doNotPlay);
    return;
  }

  try {
    app.promiseQueue?.start();
  } catch (error) {
    //Fail silently since this gives an error even after stopping the queue.
  }
};

app.pause = () => {
  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.pauseButton?.classList.add('hidden');
    app.playButton?.classList.remove('hidden');
  }
  if (!app.timeline.pausedReason) {
    app.timeline.pausedReason = 'userClick';
  }
  app.promiseQueue?.stop();
  app.timeline.isPaused = true;
};

app.minimiseBubbleActions = () => {
  bubbles.generateBubbles(true);
  app.bubbles.isExpanded = false;
  bubbles.showMinifiedBubbles();
  if (app.timeline.pausedReason === 'userClick') {
    return;
  }
  app.play(true);
};

app.expandBubbleActions = () => {
  app.bubbles.isExpanded = true;
  bubbles.showExpandedBubbles();
  bubbles.generateBubbles(true);
  if (!app.timeline.pausedReason) {
    app.timeline.pausedReason = 'bubble';
  }
  app.pause();
  app.setPlayState(false);
};

app.minifiedBubbleClickListener = (
  event: MouseEvent,
  expandOverride?: boolean
) => {
  const rect = app.minifiedBubbleContainer?.getBoundingClientRect();

  if (!rect) {
    return;
  }

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

app.addToPromiseQueue = (indexToStartFrom: number) => {
  let currentIndex = indexToStartFrom;

  if (!app.promiseQueue) {
    return;
  }

  for (let i = 0; i < currentIndex; i++) {
    app.promiseQueue?.push((cb) => {
      if (app.p && !app.isInteractiveMode) {
        const circleItem = config.timeline.circles[i];
        const { diameter, verticalSpacing } = config.timeline.circleProps;
        const circleVerticalSpace = verticalSpacing + diameter;
        const xPositionForCircle =
          config.timeline.position.x + diameter / 2 + circleVerticalSpace * i;

        app.p.push();
        app.p.fill(config.timeline.colors.black);
        app.p.textSize(12);
        app.p.strokeWeight(0.1);
        app.p.textFont('sans-serif');
        app.p.text(
          circleItem.datetime,
          xPositionForCircle,
          config.timeline.position.y
        );
        app.p.pop();
      }

      cb?.(undefined, true);
    });
  }

  while (currentIndex < config.timeline.circles.length) {
    app.promiseQueue.push((cb) => {
      const { currentIndex: _currentIndex, circlePositions } = app.timeline;
      const { x, y } = getCoordinateValues(circlePositions[_currentIndex]);
      const {
        circleProps: { diameter },
        circles,
      } = config.timeline;

      if (!circles.every(({ visited }) => visited === true)) {
        app.timeline.expandIconPositions.push({
          x: x,
          y: y + diameter / 2,
          index: _currentIndex,
        });
      }
      flow.clearBelowTimelineCircles();
      utils.markVisitedValue(_currentIndex, true);
      bubbles.generateBubbles();
      bubbles.showMinifiedBubbles();
      timeline.eraseAndRedraw();
      timeline.renderUserIcon();

      cb?.(undefined, true);
    });

    app.calculateDateTime(currentIndex);
    app.drawFlows(currentIndex);
    app.promiseQueue.push((cb) => {
      const { currentIndex: _currentIndex } = app.timeline;
      const { circles } = config.timeline;

      app.bubbles.interestGroupCounts +=
        circles[_currentIndex]?.igGroupsCount ?? 0;

      cb?.(undefined, true);
    });

    app.promiseQueue.push((cb) => {
      app.timeline.currentIndex += 1;

      if (app.timeline.currentIndex === config.timeline.circles.length) {
        app.setHasLastNodeVisited(true);
      }
      utils.wipeAndRecreateMainCanvas();

      flow.setButtonsDisabilityState();
      utils.drawOpenArrowWithoutAnimationIcon();
      cb?.(undefined, true);
    });

    currentIndex++;
  }

  // This is to add check mark for the last circle.
  app.promiseQueue.push((cb) => {
    app.bubbles.interestGroupCounts +=
      config.timeline.circles[app.timeline.currentIndex]?.igGroupsCount ?? 0;
    utils.scrollToCoordinates({ x: 0, y: 0, override: true });
    bubbles.showMinifiedBubbles();
    utils.markVisitedValue(app.timeline.currentIndex, true);
    timeline.eraseAndRedraw();
    timeline.renderUserIcon();
    flow.clearBelowTimelineCircles();

    const { circles, colors, user } = config.timeline;
    const { circlePositions } = app.timeline;
    const p = app.p;
    const up = app.up;

    utils.wipeAndRecreateUserCanvas();

    circles.forEach((__, index) => {
      p?.push();
      p?.stroke(colors.visitedBlue);
      const { x, y } = getCoordinateValues(circlePositions[index]);

      if (p?.completedCheckMark) {
        up?.image(
          p?.completedCheckMark,
          x - user.width / 2,
          y - user.height / 2,
          user.width,
          user.height
        );
      }
      p?.pop();
    });
    utils.wipeAndRecreateMainCanvas();
    utils.drawOpenArrowWithoutAnimationIcon();

    cb?.(undefined, true);
  });
};

app.setupLoop = (doNotPlay: boolean) => {
  try {
    flow.setButtonsDisabilityState();
    app.addToPromiseQueue(0);
  } catch (error) {
    //Silently fail.
  }

  timeline.eraseAndRedraw();
  timeline.renderUserIcon();
  utils.markVisitedValue(app.timeline.currentIndex, true);

  if (doNotPlay) {
    return;
  }

  app.setPlayState(true);
  try {
    app.promiseQueue?.start();
  } catch (error) {
    // Fail silently
  }
};

app.calculateDateTime = (index: number) => {
  app.promiseQueue?.push((cb) => {
    const circle = config.timeline.circles[index];
    const date = new Date();

    circle.datetime =
      date.toISOString().split('T')[0] +
      ' ' +
      date.toTimeString().split(' ')[0];

    if (circle.type === 'publisher') {
      const data = publisherData[circle.website];

      if (data) {
        data.branches.forEach((branch) => {
          branch.date = date.toDateString();
          branch.time = date.toTimeString().split(' ')[0];
        });
      }
    }

    cb?.(undefined, true);
  });
};

app.drawFlows = (index: number) => {
  joinInterestGroup.draw(index);
  auctions.draw(index);
};

app.minifiedBubbleKeyPressListener = (event) => {
  if (event.key === 'Escape' && app.bubbles.isExpanded) {
    app.minimiseBubbleActions();
  }
};

app.handleNonInteractivePrev = async () => {
  if (app.timeline.currentIndex <= 0) {
    return;
  }

  app.promiseQueue?.end();
  app.cancelPromise = true;
  app.timeline.isPaused = true;
  //This is to set the data for previous site in react as well.
  app.setCurrentSite(config.timeline.circles[app.timeline.currentIndex]);
  await utils.delay(10);

  app.timeline.currentIndex -= 1;
  app.setHasLastNodeVisited(false);

  app.setCurrentSite(config.timeline.circles[app.timeline.currentIndex - 1]);

  await utils.delay(100);

  app.addToPromiseQueue(app.timeline.currentIndex);
  flow.setButtonsDisabilityState();

  utils.markVisitedValue(app.timeline.currentIndex, true);

  utils.wipeAndRecreateMainCanvas();
  app.up?.clear();
  timeline.renderUserIcon();

  app.bubbles.interestGroupCounts =
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex) ?? 0;

  app.setPlayState(true);
  try {
    app.promiseQueue?.start();
  } catch (error) {
    // Fail silently
  }
};

app.handleInteractivePrev = () => {
  if (app.visitedIndexOrder.length === 0 || app.visitedIndexOrderTracker < 0) {
    return;
  }

  app.promiseQueue?.end();
  utils.wipeAndRecreateMainCanvas();
  flow.setButtonsDisabilityState();
  app.shouldRespondToClick = false;

  const visitedIndex = app.visitedIndexOrder[app.visitedIndexOrderTracker];

  config.timeline.circles[visitedIndex].visited = false;

  app.isRevisitingNodeInInteractiveMode = true;
  app.timeline.currentIndex = visitedIndex;
  app.usedNextOrPrev = true;

  app.drawFlows(visitedIndex);

  app.promiseQueue?.push((cb) => {
    app.shouldRespondToClick = true;
    app.isRevisitingNodeInInteractiveMode = false;
    config.timeline.circles[visitedIndex].visited = true;
    bubbles.showMinifiedBubbles();
    timeline.renderUserIcon();

    cb?.(undefined, true);
  });

  if (app.visitedIndexOrderTracker >= 0) {
    app.visitedIndexOrderTracker--;
  }

  flow.setButtonsDisabilityState();

  utils.wipeAndRecreateMainCanvas();
  utils.wipeAndRecreateUserCanvas();
  timeline.renderUserIcon();

  app.setPlayState(true);
  try {
    app.promiseQueue?.start();
  } catch (error) {
    // Fail silently
  }
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
    app.handleInteractiveNext();
    return;
  }

  app.handleNonInteractiveNext();
};

app.handleNonInteractiveNext = async () => {
  if (
    app.bubbles.isExpanded ||
    app.timeline.currentIndex > config.timeline.circles.length - 1
  ) {
    return;
  }
  app.promiseQueue?.end();
  app.timeline.isPaused = true;
  app.cancelPromise = true;
  utils.wipeAndRecreateMainCanvas();
  //This is to set the data for previous site in react as well.
  app.setCurrentSite(config.timeline.circles[app.timeline.currentIndex]);

  if (
    app.bubbles.positions.length <
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex)
  ) {
    bubbles.generateBubbles();
    bubbles.showMinifiedBubbles();
  }
  app.timeline.currentIndex += 1;

  if (app.timeline.currentIndex === config.timeline.circles.length) {
    app.setHasLastNodeVisited(true);
  }
  await utils.delay(100);

  app.addToPromiseQueue(app.timeline.currentIndex);
  flow.setButtonsDisabilityState();

  utils.markVisitedValue(app.timeline.currentIndex, true);

  utils.wipeAndRecreateMainCanvas();
  app.up?.clear();
  timeline.renderUserIcon();

  app.bubbles.interestGroupCounts =
    bubbles.calculateTotalBubblesForAnimation(app.timeline.currentIndex) ?? 0;

  app.setPlayState(true);
  try {
    app.promiseQueue?.start();
  } catch (error) {
    // Fail silently
  }
};

app.handleInteractiveNext = () => {
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

  app.promiseQueue?.end();
  flow.setButtonsDisabilityState();
  app.shouldRespondToClick = false;

  const visitedIndex = app.visitedIndexOrder[app.visitedIndexOrderTracker];

  config.timeline.circles[visitedIndex].visited = false;

  app.isRevisitingNodeInInteractiveMode = true;
  app.timeline.currentIndex = visitedIndex;
  app.usedNextOrPrev = true;

  app.drawFlows(visitedIndex);

  app.promiseQueue?.push((cb) => {
    app.shouldRespondToClick = true;
    app.isRevisitingNodeInInteractiveMode = false;
    config.timeline.circles[visitedIndex].visited = true;
    bubbles.showMinifiedBubbles();
    timeline.renderUserIcon();

    cb?.(undefined, true);
  });

  flow.setButtonsDisabilityState();

  utils.wipeAndRecreateMainCanvas();
  utils.wipeAndRecreateUserCanvas();
  timeline.renderUserIcon();

  app.setPlayState(true);
  try {
    app.promiseQueue?.start();
  } catch (error) {
    // Fail silently
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
  app.canvasParentElement = document.querySelector('#ps-canvas')?.parentElement;

  // eslint-disable-next-line no-undef
  if (process.env.IS_RUNNING_STANDALONE) {
    app.controlsDiv = document.getElementById('controls-div');
    app.nextButton = document.getElementById('next-div');
    app.prevButton = document.getElementById('previous-div');
    app.prevButton?.addEventListener('click', app.handlePrevButton);
    app.nextButton?.addEventListener('click', app.handleNextButton);
    app.playButton?.addEventListener('click', () => {
      app.play(true);
    });
    app.pauseButton?.addEventListener('click', app.pause);
    app.multSellerCheckBox?.addEventListener('change', app.toggleMultSeller);
    app.intreactiveModeCheckBox?.addEventListener(
      'change',
      app.toggleInteractiveMode
    );
    document
      .getElementById('auto-expand')
      ?.addEventListener('change', (event) => {
        app.isAutoExpand = (event.target as HTMLInputElement).checked;
      });
  }

  const minifiedBubbleContainerRect =
    app.minifiedBubbleContainer?.getBoundingClientRect();

  app.bubbles.minifiedBubbleX = Math.floor(minifiedBubbleContainerRect?.x ?? 0);
  app.bubbles.minifiedBubbleY = Math.floor(minifiedBubbleContainerRect?.y ?? 0);

  app.visitedSites = [];

  document.addEventListener('keyup', app.minifiedBubbleKeyPressListener);

  app.minifiedBubbleContainer?.addEventListener('click', (event: MouseEvent) =>
    app.minifiedBubbleClickListener(event, false)
  );

  app.bubbleContainerDiv?.addEventListener('click', (event: MouseEvent) =>
    app.minifiedBubbleClickListener(event, false)
  );

  app.closeButton?.addEventListener('click', app.minimiseBubbleActions);

  app.openButton?.addEventListener('click', (event: MouseEvent) =>
    app.minifiedBubbleClickListener(event, true)
  );
};

app.toggleInteractiveMode = async () => {
  app.isInteractiveMode = !app.isInteractiveMode;
  await app.reset();
  app.setPlayState(false);

  if (app.bubbles.isExpanded) {
    app.minimiseBubbleActions();
  }

  if (app.isInteractiveMode) {
    flow.setButtonsDisabilityState();
    return;
  }
};

// Write a callback function to get the value of the checkbox.
app.toggleMultSeller = (event: Event) => {
  app.isMultiSeller = (event.target as HTMLInputElement).checked;
};

// Define the sketch
export const sketch = (p: P5) => {
  p.updateWithProps = (props) => {
    if (Object.prototype.hasOwnProperty.call(props, 'isMultiSeller')) {
      app.isMultiSeller = props.isMultiSeller;
    }
  };

  app.promiseQueue = new Queue({
    concurrency: 1,
    autostart: false,
    results: [],
  });

  app.promiseQueue.addEventListener('end', () => {
    app.cancelPromise = true;
    app.timeline.isPaused = true;
    app.setPlayState(false);
  });

  app.promiseQueue.addEventListener('start', () => {
    app.cancelPromise = false;
    app.timeline.isPaused = false;
    app.setPlayState(true);
  });

  app.handleControls();

  p.setup = () => {
    setupMainCanvas(p, true);
  };

  p.preload = () => {
    p.userIcon = p.loadImage(icons.user);
    p.playIcon = p.loadImage(icons.play);
    p.pauseIcon = p.loadImage(icons.pause);
    p.expandIcon = p.loadImage(icons.expand);
    p.infoIcon = p.loadImage(icons.info);
    p.openWithoutAnimation = p.loadImage(icons.openWithoutAnimation);

    p.kawasaki = p.loadImage(icons.kawasaki);
    p.cnn = p.loadImage(icons.cnn);
    p.aljazeera = p.loadImage(icons.aljazeera);
    p.newyorktimes = p.loadImage(icons.newyorktimes);
    p.myntra = p.loadImage(icons.myntra);
    p.amazon = p.loadImage(icons.amazon);
    p.adidas = p.loadImage(icons.adidas);
    p.netflix = p.loadImage(icons.netflix);
    p.apple = p.loadImage(icons.apple);

    p.completedCheckMark = p.loadImage(icons.completedCheckMark);
  };
};

// Define the sketch
export const interestGroupSketch = (p: P5) => {
  p.setup = () => {
    setupInterestGroupCanvas(p);
  };

  p.updateWithProps = (props) => {
    if (props.speedMultiplier) {
      app.speedMultiplier = props.speedMultiplier;
    }

    if (props.setSelectedDateTime) {
      app.setSelectedDateTime = props.setSelectedDateTime;
    }

    if (props.setSelectedAdUnit) {
      app.setSelectedAdUnit = props.setSelectedAdUnit;
    }

    if (props.platform) {
      app.platform = props.platform;
    }

    app.isAutoExpand = props.autoExpand;

    if (
      props.expandedBubbleX &&
      props.expandedBubbleY &&
      props.expandedBubbleWidth
    ) {
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

      if (app.closeButton) {
        app.closeButton.style.left = `${x}px`;
        app.closeButton.style.top = `${y}px`;
      }
      const expandedSVG = document.getElementById('expandedSVG');

      if (expandedSVG) {
        bubbles.showExpandedBubbles();
      }
    }

    if (props.setIsBubbleExpanded) {
      app.setIsBubbleExpanded = props.setIsBubbleExpanded;
    }

    if (props.setCurrentStep) {
      app.setCurrentStep = props.setCurrentStep;
    }

    if (props.setHasLastNodeVisited) {
      app.setHasLastNodeVisited = props.setHasLastNodeVisited;
    }

    if (typeof props.autoScroll !== 'undefined') {
      app.autoScroll = props.autoScroll;
    }

    if (props.setCurrentSite) {
      app.setCurrentSite = props.setCurrentSite;
    }

    if (props.setInfo) {
      app.setInfo = props.setInfo;
    }

    if (props.setHighlightedInterestGroup) {
      app.setHighlightedInterestGroup = props.setHighlightedInterestGroup;
    }

    if (app.setPlayState) {
      app.setPlayState = props.setPlayState;
    }
  };
};

// Define the sketch
export const userSketch = (p: P5) => {
  p.setup = () => {
    setupUserCanvas(p);
  };
};

app.reset = async () => {
  app.promiseQueue?.end();
  app.nodeIndexRevisited = -1;
  app.cancelPromise = true;
  app.timeline.isPaused = true;
  app.visitedIndexOrder = [];
  app.visitedIndexes = 1;
  app.visitedIndexOrderTracker = -1;

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

  if (app.igp) {
    setupInterestGroupCanvas(app.igp);
  }

  if (app.up) {
    setupUserCanvas(app.up);
  }

  if (app.p) {
    setupMainCanvas(app.p, true);
  }

  app.timeline.isPaused = true;
  app.timeline.pausedReason = 'userClick';
  app.setPlayState(false);
  app.setCurrentSite(null);
  app.setInfo(null);
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

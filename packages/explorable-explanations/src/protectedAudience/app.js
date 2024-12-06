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
const app = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    smallCirclePositions: [],
    circlePublisherIndices: [],
    expandIconPositions: [],
    currentIndex: 0,
  },
  color: null,
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
    interestGroupCounts: 0,
    minifiedBubbleX: 0,
    minifiedBubbleY: 0,
    isExpanded: false,
    expandedBubbleX: 0,
    expandedBubbleY: 0,
    expandedCircleDiameter: 640,
    minifiedCircleDiameter: 50,
  },
  p: null,
  igp: null,
  up: null,
  isMultiSeller: false,
  cancelPromise: false,
  isInteractiveMode: false,
  mouseX: 0,
  mouseY: 0,
  shouldRespondToClick: true,
  startTrackingMouse: true,
  visitedIndexes: 1,
  visitedIndexOrder: [],
  visitedIndexOrderTracker: -1,
  isRevisitingNodeInInteractiveMode: false,
  canvasEventListerners: {
    main: {
      mouseOver: {},
      mouseOut: {},
      mouseMoved: {},
    },
  },
};

export default app;

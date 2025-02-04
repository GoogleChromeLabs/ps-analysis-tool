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

// infoIcon: p5.Image;
//   expandIcon: p5.Image;
//   openWithoutAnimation: p5.Image;
//   userIcon: p5.Image;
//   playIcon: p5.Image;
//   pauseIcon: p5.Image;
//   completedCheckMark: p5.Image;
//   isMultiSeller: boolean;
//   isInteractiveMode: boolean;
//   autoScroll: boolean;
//   speedMultiplier: number;
//   expandedBubbleX: number;
//   expandedBubbleY: number;
//   expandedBubbleWidth: number;
//   expandedBubbleHeight: number;
//   minifiedBubbleX: number;
//   minifiedBubbleY: number;
//   minifiedBubbleWidth: number;
//   minifiedBubbleHeight: number;
//   autoExpand: boolean;
//   setSelectedDateTime: (time: string) => void;
//   setSelectedAdUnit: (adUnit: string) => void;
//   setCurrentStep: (step: number) => void;
//   setCurrentSite: (site: Circle | null) => void;
//   setInfo: (
//     info: {
//       title: string;
//       description: string;
//       info: string | boolean;
//       key: number;
//     } | null
//   ) => void;
//   setHighlightedInterestGroup: () => void;
//   setPlayState: (play: boolean) => void;
//   getPlayState: () => void;
//   setSelectedExpandedFlow: () => void;
//   setIsBubbleExpanded: (isExpanded: boolean) => void;

/**
 * External dependencies
 */
import Queue from 'queue';
import { noop } from '@google-psat/common';
import type * as d3 from 'd3';

/**
 * Internal dependencies
 */
import { AuctionStep, Circle, Coordinates, P5, Bubble, Step } from '../types';
import { Config } from './config';

type CoordinatesWithIndex = Coordinates & {
  index: number;
};

export type App = {
  timeline: {
    isPaused: boolean;
    circlePositions: Coordinates[];
    smallCirclePositions: Coordinates[];
    circlePublisherIndices: number[];
    expandIconPositions: CoordinatesWithIndex[];
    currentIndex: number;
    pausedReason: string;
    infoIconsPositions: Record<string, unknown>[];
    renderUserIcon: () => void;
    drawTimelineLine: () => void;
    drawTimeline: (timeline: Config['timeline']) => void;
  };
  color: d3.ScaleOrdinal<string, string> | null;
  auction: {
    auctions: AuctionStep[][];
    nextTipCoordinates: Coordinates;
  };
  joinInterestGroup: {
    joinings: AuctionStep[][];
    nextTipCoordinates: Coordinates;
  };
  flow: {
    intervals: Record<string, unknown>;
  };
  bubbles: {
    positions: Bubble[];
    minifiedSVG: null;
    expandedSVG: null;
    interestGroupCounts: number;
    minifiedBubbleX: number;
    minifiedBubbleY: number;
    isExpanded: boolean;
    expandedBubbleX: number;
    expandedBubbleY: number;
    expandedCircleDiameter: number;
    minifiedCircleDiameter: number;
    highlightedInterestGroup: string | null;
  };
  bubblesContainerDiv: HTMLElement | null;
  autoScroll: boolean;
  mouseOutOfDiv: boolean;
  speedMultiplier: number;
  p: P5 | null;
  igp: P5 | null;
  up: P5 | null;
  isAutoExpand: boolean;
  isMultiSeller: boolean;
  cancelPromise: boolean;
  isInteractiveMode: boolean;
  mouseX: number;
  mouseY: number;
  shouldRespondToClick: boolean;
  startTrackingMouse: boolean;
  visitedIndexes: number;
  visitedIndexOrder: number[];
  visitedIndexOrderTracker: number;
  isRevisitingNodeInInteractiveMode: boolean;
  nodeIndexRevisited: number;
  setInfo: (
    info: {
      title: string;
      description: string;
      info: string | boolean;
      key: number;
    } | null
  ) => void;
  createCanvas: () => void;
  setHighlightedInterestGroup: () => void;
  getPlayState: () => void;
  setSelectedExpandedFlow: () => void;
  setSelectedAdUnit: (adUnit: string) => void;
  setSelectedDateTime: (time: string) => void;
  setUpTimeLine: () => void;
  setup: () => void;
  play: (play: boolean, pause?: boolean) => void;
  expandBubbleActions: () => void;
  minimiseBubbleActions: () => void;
  pause: () => void;
  setPlayState: (play: boolean) => void;
  setPauseState: (pause: boolean) => void;
  setPauseReason: (pauseReason: string) => void;
  setupLoop: (doNotPlay: boolean) => void;
  toggleInteractiveMode: () => void;
  toggleMultSeller: (event: Event) => void;
  reset: () => void;
  minifiedBubbleClickListener: (
    event: MouseEvent,
    expandOverride?: boolean
  ) => void;
  usedNextOrPrev: boolean;
  promiseQueue: Queue | null;
  canvasEventListerners: {
    main: {
      mouseOver: Record<string, unknown>;
      mouseOut: Record<string, unknown>;
      mouseMoved: Record<string, unknown>;
      mouseClicked: Record<string, unknown>;
    };
  };
  closeButton: HTMLElement | null;
  minifiedBubbleContainer: HTMLElement | null;
  openButton: HTMLElement | null;
  playButton: HTMLElement | null;
  pauseButton: HTMLElement | null;
  multSellerCheckBox: HTMLElement | null;
  intreactiveModeCheckBox: HTMLElement | null;
  countDisplay: HTMLElement | null;
  bubbleContainerDiv: HTMLElement | null;
  canvasParentElement?: HTMLElement | null;
  controlsDiv: HTMLElement | null;
  nextButton: HTMLElement | null;
  prevButton: HTMLElement | null;
  addToPromiseQueue: (indexToStartFrom: number) => void;
  drawFlows: (index: number) => void;
  minifiedBubbleKeyPressListener: (event: KeyboardEvent) => void;
  handleNonInteractivePrev: () => Promise<void> | void;
  handleNonInteractiveNext: () => Promise<void> | void;
  handleInteractivePrev: () => Promise<void> | void;
  handleInteractiveNext: () => Promise<void> | void;
  setCurrentSite: (site: Circle | null) => void;
  handlePrevButton: () => void;
  handleNextButton: () => void;
  handleControls?: () => void;
  setIsBubbleExpanded: (isExpanded: boolean) => void;
  visitedSites: string[];
  setCurrentStep: (step: number | Step) => void;
};

// App defaults
const app: App = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    smallCirclePositions: [],
    circlePublisherIndices: [],
    expandIconPositions: [],
    currentIndex: 0,
    pausedReason: '',
    infoIconsPositions: [],
    renderUserIcon: noop,
    drawTimelineLine: noop,
    drawTimeline: noop,
  },
  closeButton: null,
  color: null,
  multSellerCheckBox: null,
  intreactiveModeCheckBox: null,
  countDisplay: null,
  bubbleContainerDiv: null,
  canvasParentElement: null,
  controlsDiv: null,
  nextButton: null,
  prevButton: null,
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
    highlightedInterestGroup: null,
  },
  autoScroll: true,
  mouseOutOfDiv: false,
  speedMultiplier: 3,
  p: null,
  igp: null,
  up: null,
  isAutoExpand: true,
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
  nodeIndexRevisited: -1,
  setCurrentSite: noop,
  setCurrentStep: noop,
  setInfo: noop,
  setHighlightedInterestGroup: noop,
  setPlayState: noop,
  getPlayState: noop,
  setSelectedExpandedFlow: noop,
  setSelectedAdUnit: noop,
  setSelectedDateTime: noop,
  setUpTimeLine: noop,
  play: noop,
  setup: noop,
  expandBubbleActions: noop,
  minimiseBubbleActions: noop,
  minifiedBubbleClickListener: noop,
  pause: noop,
  setPauseState: noop,
  setPauseReason: noop,
  setupLoop: noop,
  addToPromiseQueue: noop,
  drawFlows: noop,
  setIsBubbleExpanded: noop,
  minifiedBubbleKeyPressListener: noop,
  handleNonInteractivePrev: noop,
  handleNonInteractiveNext: noop,
  handleInteractivePrev: noop,
  handleInteractiveNext: noop,
  handlePrevButton: noop,
  handleNextButton: noop,
  handleControls: noop,
  visitedSites: [],
  toggleInteractiveMode: noop,
  toggleMultSeller: noop,
  reset: noop,
  createCanvas: noop,
  minifiedBubbleContainer: null,
  openButton: null,
  usedNextOrPrev: false,
  promiseQueue: null,
  bubblesContainerDiv: null,
  canvasEventListerners: {
    main: {
      mouseOver: {},
      mouseOut: {},
      mouseMoved: {},
      mouseClicked: {},
    },
  },
  playButton: null,
  pauseButton: null,
};

export default app;

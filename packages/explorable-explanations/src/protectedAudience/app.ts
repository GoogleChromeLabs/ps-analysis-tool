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
import Queue from 'queue';
import { noop } from '@google-psat/common';
import type * as d3 from 'd3';

/**
 * Internal dependencies
 */
import type {
  AuctionStep,
  Coordinates,
  P5,
  Bubble,
  SketchProps,
} from './types';
import { Config } from './config';

// Sketch props added to the app object during initialization
type SketchSharedProps = Pick<
  SketchProps,
  | 'setIsBubbleExpanded'
  | 'setSelectedExpandedFlow'
  | 'setPlayState'
  | 'getPlayState'
  | 'setHighlightedInterestGroup'
  | 'setInfo'
  | 'setCurrentSite'
  | 'setCurrentStep'
  | 'setSelectedAdUnit'
  | 'setSelectedDateTime'
  | 'speedMultiplier'
  | 'autoScroll'
  | 'isInteractiveMode'
  | 'isMultiSeller'
  | 'setHasLastNodeVisited'
  | 'platform'
>;

type CoordinatesWithIndex = Coordinates & {
  index: number;
};

type MouseCallback = (mouseX: number, mouseY: number) => void;

export type App = {
  p: P5 | null;
  igp: P5 | null;
  up: P5 | null;
  isAutoExpand: boolean;
  isMultiSeller: boolean;
  cancelPromise: boolean;
  mouseOutOfDiv: boolean;
  platform: string;
  mouseX: number;
  mouseY: number;
  shouldRespondToClick: boolean;
  startTrackingMouse: boolean;
  visitedIndexes: number;
  visitedIndexOrder: number[];
  visitedIndexOrderTracker: number;
  isRevisitingNodeInInteractiveMode: boolean;
  nodeIndexRevisited: number;
  usedNextOrPrev: boolean;
  promiseQueue: Queue | null;
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
  nextButton: HTMLButtonElement | null;
  prevButton: HTMLButtonElement | null;
  bubblesContainerDiv: HTMLElement | null;
  timeline: {
    isPaused: boolean;
    circlePositions: Coordinates[];
    smallCirclePositions: Coordinates[];
    circlePublisherIndices: number[];
    expandIconPositions: CoordinatesWithIndex[];
    currentIndex: number;
    pausedReason: string;
    infoIconsPositions: CoordinatesWithIndex[];
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
    minifiedSVG: SVGElement | null;
    expandedSVG: SVGElement | null;
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
  canvasEventListerners: {
    main: {
      mouseOver: Record<string, MouseCallback>;
      mouseOut: Record<string, MouseCallback>;
      mouseMoved: Record<string, MouseCallback>;
      mouseClicked: Record<string, MouseCallback>;
    };
    interestGroup: {
      mouseOver: Record<string, MouseCallback>;
      mouseOut: Record<string, MouseCallback>;
      mouseMoved: Record<string, MouseCallback>;
      mouseClicked: Record<string, MouseCallback>;
    };
    user: {
      mouseOver: Record<string, MouseCallback>;
      mouseOut: Record<string, MouseCallback>;
      mouseMoved: Record<string, MouseCallback>;
      mouseClicked: Record<string, MouseCallback>;
    };
  };
  createCanvas: () => void;
  setUpTimeLine: () => void;
  setup: () => void;
  play: (resumed?: boolean, doNotPlay?: boolean) => void;
  expandBubbleActions: () => void;
  minimiseBubbleActions: () => void;
  pause: () => void;
  setPauseState: (pause: boolean) => void;
  setPauseReason: (pauseReason: string) => void;
  setupLoop: (doNotPlay: boolean) => void;
  toggleInteractiveMode: () => void;
  toggleMultSeller: (event: Event) => void;
  reset: () => void;
  minifiedBubbleClickListener: (
    event: MouseEvent,
    expandOverride: boolean
  ) => void;
  addToPromiseQueue: (indexToStartFrom: number) => void;
  calculateDateTime: (index: number) => void;
  drawFlows: (index: number) => void;
  minifiedBubbleKeyPressListener: (event: KeyboardEvent) => void;
  handleNonInteractivePrev: () => Promise<void> | void;
  handleNonInteractiveNext: () => Promise<void> | void;
  handleInteractivePrev: () => Promise<void> | void;
  handleInteractiveNext: () => Promise<void> | void;
  handlePrevButton: () => void;
  handleNextButton: () => void;
  handleControls: () => void;
  visitedSites: string[];
} & SketchSharedProps;

// App defaults
const app: App = {
  p: null,
  igp: null,
  up: null,
  platform: '',
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
  autoScroll: true,
  mouseOutOfDiv: false,
  speedMultiplier: 1,
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
  minifiedBubbleContainer: null,
  openButton: null,
  usedNextOrPrev: false,
  promiseQueue: null,
  bubblesContainerDiv: null,
  playButton: null,
  pauseButton: null,
  visitedSites: [],
  canvasEventListerners: {
    main: {
      mouseOver: {},
      mouseOut: {},
      mouseMoved: {},
      mouseClicked: {},
    },
    interestGroup: {
      mouseOver: {},
      mouseOut: {},
      mouseMoved: {},
      mouseClicked: {},
    },
    user: {
      mouseOver: {},
      mouseOut: {},
      mouseMoved: {},
      mouseClicked: {},
    },
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
  calculateDateTime: noop,
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
  toggleInteractiveMode: noop,
  toggleMultSeller: noop,
  reset: noop,
  createCanvas: noop,
  setHasLastNodeVisited: noop,
};

export default app;

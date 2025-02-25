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
import type p5 from 'p5';

export type Bubble = {
  id?: string;
  value?: number;
  group?: string;
  color?: string;
};

export type Step = {
  title: string;
  description: string;
  ssp: string;
};

export type SketchProps = {
  infoIcon: p5.Image;
  expandIcon: p5.Image;
  openWithoutAnimation: p5.Image;
  userIcon: p5.Image;
  playIcon: p5.Image;
  pauseIcon: p5.Image;
  completedCheckMark: p5.Image;
  kawasaki: p5.Image;
  cnn: p5.Image;
  aljazeera: p5.Image;
  newyorktimes: p5.Image;
  myntra: p5.Image;
  amazon: p5.Image;
  adidas: p5.Image;
  netflix: p5.Image;
  apple: p5.Image;
  isMultiSeller: boolean;
  isInteractiveMode: boolean;
  autoScroll: boolean;
  speedMultiplier: number;
  expandedBubbleX: number;
  expandedBubbleY: number;
  expandedBubbleWidth: number;
  expandedBubbleHeight: number;
  minifiedBubbleX: number;
  minifiedBubbleY: number;
  minifiedBubbleWidth: number;
  minifiedBubbleHeight: number;
  autoExpand: boolean;
  setSelectedDateTime: (time: string) => void;
  setSelectedAdUnit: (adUnit: string) => void;
  setCurrentStep: (step: number | Step) => void;
  setCurrentSite: (site: Circle | null) => void;
  setInfo: (
    info: {
      title: string;
      description: string;
      info: string | boolean;
      key: number;
    } | null
  ) => void;
  setHighlightedInterestGroup: (params?: {
    interestGroupName: string;
    interestGroupOwner: string;
    color: string;
  }) => void;
  setPlayState: (play: boolean) => void;
  getPlayState: () => void;
  setSelectedExpandedFlow: () => void;
  setIsBubbleExpanded: (isExpanded: boolean) => void;
  setHasLastNodeVisited: (hasLastNodeVisited: boolean) => void;
};

export type P5 = p5 & {
  updateWithProps?: (props: SketchProps) => void;
} & SketchProps;

export type CoordinateValue = number | (() => number);

export type Coordinates = {
  x: CoordinateValue;
  y: CoordinateValue;
  down?: Coordinates;
};

export type Circle = {
  type: 'advertiser' | 'publisher';
  website: string;
  datetime: string;
  igGroupsCount?: number;
  interestGroups?: string[];
  visited: boolean;
  visitedIndex: number | null;
  logoSize?: { width: number; height: number };
};

export type AuctionStepProps = {
  x?: CoordinateValue;
  y?: CoordinateValue;
  x1?: CoordinateValue;
  y1?: CoordinateValue;
  currentIndex?: number;
  down?: Coordinates;
  branches?: {
    title?: string;
    description?: string;
    type?: string;
    color?: string;
    date?: string | (() => string);
    time?: string | (() => string);
  }[];
  direction?: string;
  noArrow?: boolean;
  isBranch?: boolean;
  title?: string;
  width?: number;
  height?: number;
  borderStroke?: number[];
  info?: React.ReactNode;
  color?: string;
  customWidth?: number;
  customHeight?: number;
  ssp?: string;
  text?: string;
  description?: string;
  showBarrageAnimation?: boolean;
  showWinningAd?: boolean;
  showRippleEffect?: boolean;
  isBranchComponent?: boolean;
};

export type AuctionStep = {
  // component could be any function with an arbitrary number of arguments and return type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: (...args: any[]) => any;
  props?: AuctionStepProps;
  callBack?: (returnValue: Coordinates) => void;
  delay?: number;
};

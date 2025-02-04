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
  setHighlightedInterestGroup: () => void;
  setPlayState: (play: boolean) => void;
  getPlayState: () => void;
  setSelectedExpandedFlow: () => void;
  setIsBubbleExpanded: (isExpanded: boolean) => void;
};

export type P5 = p5 & {
  updateWithProps?: (props: SketchProps) => void;
} & SketchProps;

export type Coordinates = {
  x: number;
  y: number;
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
};

export type AuctionStep = {
  // component could be any function with an arbitrary number of arguments and return type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: (...args: any[]) => any;
  props?: {
    x?: number | (() => number);
    y?: number | (() => number);
    x1?: number | (() => number);
    y1?: number | (() => number);
    currentIndex?: number;
    branches?: {
      title?: string;
      description?: string;
      type?: string;
      color?: string;
      date?: string;
      time?: string;
    }[];
    direction?: string;
    noArrow?: boolean;
    title?: string;
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
  };
  callBack?: (returnValue: Coordinates) => void;
  delay?: number;
};

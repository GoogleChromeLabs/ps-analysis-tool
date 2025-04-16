/*
 * Copyright 2025 Google LLC
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
import type p5 from 'p5';
import { ADTECH_COLORS } from './utils';

export type WebsiteLogos = {
  'tmz.com': p5.Image | null;
  'cnet.com': p5.Image | null;
  'espn.com': p5.Image | null;
  'investopedia.com': p5.Image | null;
  'tripadvisor.com': p5.Image | null;
  'allrecipes.com': p5.Image | null;
  'vogue.com': p5.Image | null;
  'bloomberg.com': p5.Image | null;
  'linkedin.com': p5.Image | null;
  'rollingstone.com': p5.Image | null;
  'cnn.com': p5.Image | null;
  'techcrunch.com': p5.Image | null;
  'cbssports.com': p5.Image | null;
  'healthline.com': p5.Image | null;
  'expedia.com': p5.Image | null;
  'foodnetwork.com': p5.Image | null;
  'cosmopolitan.com': p5.Image | null;
  'nerdwallet.com': p5.Image | null;
  'indeed.com': p5.Image | null;
  'crunchyroll.com': p5.Image | null;
};

export type AdtechType = keyof typeof ADTECH_COLORS;

export type App = {
  userIcon: p5.Image | null;
  completedIcon: p5.Image | null;
  circlePositions: Record<number, { x: number; y: number }>;
  siteAdTechs: Record<string, string[]>;
  visitIndex: number;
  playing: boolean;
  speedMultiplier: number;
  inspectedCircleIndex: number;
  prevVisitedCircleIndex: number;
  showHandCursor: boolean;
  canvas: p5.Renderer | null;
  smallCirclePositions: Record<number, { x: number; y: number }[]>;
  counter: number;
  lastFrameCount: number;
  inspectedCircles: Set<number>;
  isTextLoadingCoverVisible: boolean;

  drawTimeline: (
    position: { x: number; y: number },
    circles: { datetime: string; website: string; topics: string[] }[]
  ) => void;

  drawCircle: (index: number, visited?: boolean) => void;

  play: () => void;

  reset: () => void;

  getCurrentVisitIndex: () => number;

  updateSpeedMultiplier: (speedMultiplier: number) => void;

  userVisitDone: (index: number) => void;

  handleUserVisit: (visitIndex: number, calculate?: boolean) => void;

  drawSmallCircles: (index: number, currentSite: string) => void;

  drawInfoBox: (index: number, currentSite: string) => void;

  resetInfoBox: (index: number) => void;

  mouseMoved: () => void;

  mouseClicked: () => void;
  togglePlay: (state: boolean) => void;
} & WebsiteLogos;

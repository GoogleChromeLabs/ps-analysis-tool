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
import p5 from 'p5';

/**
 * Internal dependencies
 */

import { config } from './config';
import { Circle, InfoBox, SmallCircle, clearInfoBox } from './components';
import { getSmallCirclePositions } from './utils';
import assets from './assets';

export type Epoch = { datetime: string; website: string; topics: string[] };

export type TopicsAnimationProps = {
  p: p5;
  epoch: Epoch[];
  isInteractive: boolean;
  siteAdTechs: Record<string, string[]>;
  handleUserVisit: (visitIndex: number) => void;
  setHighlightAdTech: (highlightAdTech: string | null) => void;
  isAnimating: boolean;
  visitIndexStart: number;
  onReady?: () => void;
};

class TopicsAnimation {
  p: p5;

  // assets
  userIcon: p5.Image | null = null;
  completedIcon: p5.Image | null = null;
  'tmz.com': p5.Image | null = null;
  'cnet.com': p5.Image | null = null;
  'espn.com': p5.Image | null = null;
  'investopedia.com': p5.Image | null = null;
  'tripadvisor.com': p5.Image | null = null;
  'allrecipes.com': p5.Image | null = null;
  'vogue.com': p5.Image | null = null;
  'bloomberg.com': p5.Image | null = null;
  'linkedin.com': p5.Image | null = null;
  'rollingstone.com': p5.Image | null = null;
  'cnn.com': p5.Image | null = null;
  'techcrunch.com': p5.Image | null = null;
  'cbssports.com': p5.Image | null = null;
  'healthline.com': p5.Image | null = null;
  'expedia.com': p5.Image | null = null;
  'foodnetwork.com': p5.Image | null = null;
  'cosmopolitan.com': p5.Image | null = null;
  'nerdwallet.com': p5.Image | null = null;
  'indeed.com': p5.Image | null = null;
  'crunchyroll.com': p5.Image | null = null;

  // state
  circlePositions: Record<number, { x: number; y: number }> = {};
  siteAdTechs: Record<string, string[]> = {};
  visitIndex = 0;
  playing = true;
  speedMultiplier = 1;
  inspectedCircleIndex = -1;
  inspectedSmallCircleIndex = '';
  prevVisitedCircleIndex = -1;
  showHandCursor = false;
  canvas: p5.Renderer | null = null;
  smallCirclePositions: Record<number, { x: number; y: number }[]> = {};
  inspectedCircles: Set<number> = new Set();
  isTextLoadingCoverVisible = true;
  isInited = false;

  // props
  epoch: TopicsAnimationProps['epoch'];
  isInteractive: TopicsAnimationProps['isInteractive'];
  _handleUserVisit: TopicsAnimationProps['handleUserVisit'];
  setHighlightAdTech: TopicsAnimationProps['setHighlightAdTech'];
  isAnimating: TopicsAnimationProps['isAnimating'];
  visitIndexStart: TopicsAnimationProps['visitIndexStart'];
  onReady: TopicsAnimationProps['onReady'];

  constructor({
    p,
    epoch,
    isInteractive,
    siteAdTechs,
    handleUserVisit,
    setHighlightAdTech,
    isAnimating,
    visitIndexStart,
    onReady,
  }: TopicsAnimationProps) {
    this.p = p;
    this.epoch = epoch;
    this.isInteractive = isInteractive;
    this.siteAdTechs = siteAdTechs;
    this._handleUserVisit = handleUserVisit;
    this.setHighlightAdTech = setHighlightAdTech;
    this.isAnimating = isAnimating;
    this.onReady = onReady;
    if (visitIndexStart && isAnimating && !this.isInteractive) {
      this.visitIndex = visitIndexStart;
    }
    p.preload = this.preload;
    p.setup = this.setup;
  }

  private preload = () => {
    Object.keys(assets).forEach((key) => {
      this[key] = this.p.loadImage(assets[key]);
    });
  };

  private setup = () => {
    const p = this.p;
    const circleHorizontalSpace =
      config.timeline.circleProps.horizontalSpacing +
      config.timeline.circleProps.diameter;
    this.canvas = p.createCanvas(
      circleHorizontalSpace * 6,
      config.canvas.height
    );
    p.pixelDensity(2);
    p.textFont('sans-serif');
    // register events
    this.canvas.mouseClicked(this.mouseClicked);
  };

  private draw = () => {
    if (!this.isInited) {
      this.isInited = true;
      this.onReady?.();
      return;
    }

    this.p.background(255); // clear canvas
    this.drawTimeline();
    this.drawCursor();

    this.inspectedCircleIndex = this.getInspectedCircleIndex();
    this.inspectedSmallCircleIndex = this.getInspectedSmallCircleIndex();

    if (this.isInteractive) {
      this.playing = false;
      this.drawInteractiveMode();
    } else {
      this.incrementVisitIndex();
      this.drawVisitedCircles();
    }
  };

  private incrementVisitIndex = () => {
    if (!this.playing) {
      return;
    }

    // always delay first animation
    if (this.visitIndex === 0 && this.p.frameCount < 40) {
      return;
    }

    const step = config.timeline.stepDelay / this.speedMultiplier;
    const delay = step / 10;

    if (this.p.frameCount % delay === 0) {
      this.visitIndex++;
    }
  };

  private drawVisitedCircles = () => {
    if (this.visitIndex === this.epoch.length) {
      this.playing = false;
    }

    for (let i = 0; i < this.visitIndex; i++) {
      this.handleUserVisit(i);
    }
    this.drawInspectedCircle();

    if (this.inspectedSmallCircleIndex !== '') {
      this.showHandCursor = true;
    }
  };

  private drawInspectedCircle = () => {
    const index = this.inspectedCircleIndex;
    if (index === -1 || index >= this.visitIndex) {
      return;
    }
    this.resetInfoBox(this.visitIndex - 1);
    this.drawInfoBox(index, this.epoch[index].website);
  };

  userVisitDone = (index: number) => {
    this.resetInfoBox(index);
    this.drawCircle(index, true);
  };

  handleUserVisit = (visitIndex: number) => {
    const p = this.p;
    if (visitIndex > 0 && !this.isInteractive) {
      this.userVisitDone(visitIndex - 1);
    }

    if (visitIndex >= this.epoch.length) {
      if (visitIndex === this.epoch.length) {
        this._handleUserVisit(visitIndex);
      }
      return;
    }

    const circlePosition = this.circlePositions[visitIndex];

    if (circlePosition === undefined) {
      return;
    }

    const user = config.timeline.user;

    p.image(
      this.userIcon as p5.Image,
      circlePosition.x - user.width / 2,
      circlePosition.y - user.height / 2,
      user.width,
      user.height
    );

    const position = this.circlePositions[visitIndex];
    const previousPosition =
      this.circlePositions?.[visitIndex - 1] || config.timeline.position;
    const circleDiameter = config.timeline.circleProps.diameter;
    const { diameter, horizontalSpacing } = config.timeline.circleProps;
    const circleVerticalSpace = horizontalSpacing - 30 + diameter;
    const xPosition = horizontalSpacing + circleVerticalSpace * visitIndex;
    const currentCircle = this.epoch[visitIndex];

    if (!this.isInteractive) {
      p.push();
      p.text(currentCircle.datetime, xPosition, 35);
      p.stroke('#1A73E8');
      p.line(
        previousPosition.x + (visitIndex !== 0 ? circleDiameter / 2 : 0),
        previousPosition.y,
        position.x - circleDiameter / 2,
        position.y
      );
      p.pop();
    }

    const currentSite = currentCircle.website;
    this.drawInfoBox(visitIndex, currentSite);
    this.drawSmallCircles(visitIndex, currentSite);
    this._handleUserVisit(visitIndex);
  };

  resetInfoBox(index: number) {
    const p = this.p;
    const position = this.circlePositions[index];
    const { diameter } = config.timeline.circleProps;
    clearInfoBox(p, position, diameter);
  }

  mouseClicked = () => {
    if (this.playing) {
      return;
    }

    if (this.isInteractive && this.inspectedCircleIndex !== -1) {
      const index = this.inspectedCircleIndex;
      if (this.prevVisitedCircleIndex === index) {
        return;
      }

      if (this.prevVisitedCircleIndex !== -1) {
        this.userVisitDone(this.prevVisitedCircleIndex);
      }

      if (this.smallCirclePositions[index] === undefined) {
        this.handleUserVisit(index);
      } else {
        this.drawInfoBox(index, this.epoch[index].website);
      }
      this.prevVisitedCircleIndex = index;
    }

    if (this.inspectedSmallCircleIndex !== '') {
      const [circleIndex, smallCircleIndex] =
        this.inspectedSmallCircleIndex.split('-');

      this.setHighlightAdTech(
        this.siteAdTechs[this.epoch[Number(circleIndex)].website][
          Number(smallCircleIndex)
        ]
      );
    }
  };

  private drawInfoBox(index: number, currentSite: string) {
    const p = this.p;
    const position = this.circlePositions[index];
    const topics = this.epoch[index].topics;
    const { diameter } = config.timeline.circleProps;
    const adTechs = this.siteAdTechs[currentSite];
    InfoBox({ p, position, diameter, topics, adTechs });
  }

  private drawSmallCircles(index: number, currentSite: string) {
    const p = this.p;
    const { diameter } = config.timeline.circleProps;
    const smallCircleDiameter = diameter / 5;
    const adTechs = this.siteAdTechs[currentSite];

    let appSmallCirclePositions = this.smallCirclePositions[index];
    // generate small circle positions if they don't exist
    if (appSmallCirclePositions === undefined) {
      const position = this.circlePositions[index];
      appSmallCirclePositions = getSmallCirclePositions(
        adTechs.length,
        position,
        diameter,
        smallCircleDiameter
      );
      // store small circle positions
      this.smallCirclePositions[index] = appSmallCirclePositions;
    }

    if (appSmallCirclePositions) {
      for (let i = 0; i < appSmallCirclePositions.length; i++) {
        const smallCirclePosition = appSmallCirclePositions[i];
        SmallCircle(
          p,
          adTechs[i],
          smallCirclePosition.x,
          smallCirclePosition.y,
          smallCircleDiameter
        );
      }
      return;
    }
  }

  private drawCircle = (index: number, visited?: boolean) => {
    const p = this.p;
    const position = this.circlePositions[index];
    const { diameter } = config.timeline.circleProps;

    Circle({
      p,
      position,
      visited: Boolean(visited),
      completedIcon: this.completedIcon as p5.Image,
      diameter,
    });
  };

  private drawTimeline = () => {
    const p = this.p;
    const { diameter, horizontalSpacing } = config.timeline.circleProps;
    const circleVerticalSpace = horizontalSpacing - 30 + diameter;
    const position = config.timeline.position;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);

    this.epoch.forEach((circleItem, index) => {
      const xPosition = horizontalSpacing + circleVerticalSpace * index;

      if (this?.[circleItem.website]) {
        p.image(
          this[circleItem.website],
          xPosition - diameter / 4 - 3,
          55,
          diameter / 2 + 8,
          diameter / 2 + 8
        );
      }

      p.text(circleItem.website, xPosition, position.y - 70);
      p.line(xPosition, position.y - 50, xPosition, position.y);

      this.circlePositions[index] = { x: xPosition, y: position.y };
      this.drawCircle(index);
    });
  };

  private drawCursor = () => {
    const p = this.p;
    if (this.showHandCursor) {
      p.cursor(p.HAND);
    } else {
      p.cursor(p.ARROW);
    }
  };

  private drawInteractiveMode = () => {
    const p = this.p;
    const x = p.mouseX;
    const y = p.mouseY;
    const user = config.timeline.user;

    this.showHandCursor = false;
    const isInspectingCircle = this.inspectedCircleIndex !== -1;
    const isInspectingSmallCircle = this.inspectedSmallCircleIndex !== '';

    const lastVisitedIndex = this.prevVisitedCircleIndex;
    // draw already visited/inspected circles
    if (lastVisitedIndex !== -1) {
      this.inspectedCircles.add(lastVisitedIndex);
      const inspectedCirclesArray = Array.from(this.inspectedCircles);
      for (let i = 0; i < inspectedCirclesArray.length; i++) {
        const index = inspectedCirclesArray[i];
        if (lastVisitedIndex === index) {
          this.handleUserVisit(index);
        } else {
          this.userVisitDone(index);
        }
        this.drawSmallCircles(index, this.epoch[index].website);
      }
      this.drawInfoBox(lastVisitedIndex, this.epoch[lastVisitedIndex].website);
    }

    if (isInspectingSmallCircle) {
      this.showHandCursor = true;
      return;
    }

    if (
      isInspectingCircle &&
      this.inspectedCircles.has(this.inspectedCircleIndex)
    ) {
      this.showHandCursor = true;
      return;
    }

    p.image(
      this.userIcon as p5.Image,
      x - user.width / 2,
      y - user.height / 2,
      user.width,
      user.height
    );
  };

  private getInspectedCircleIndex = (): number => {
    if (this.playing) {
      return -1;
    }

    const p = this.p;
    const x = p.mouseX;
    const y = p.mouseY;

    let inspectedCircleIndex = -1;
    this.showHandCursor = false;

    Object.values(this.circlePositions).forEach((position, index) => {
      const { diameter } = config.timeline.circleProps;
      const { x: circleX, y: circleY } = position;

      if (
        x > circleX - diameter / 2 &&
        x < circleX + diameter / 2 &&
        y > circleY - diameter / 2 &&
        y < circleY + diameter / 2
      ) {
        inspectedCircleIndex = index;
      }
    });

    return inspectedCircleIndex;
  };

  private getInspectedSmallCircleIndex = (): string => {
    if (this.playing) {
      return '';
    }

    const p = this.p;
    const x = p.mouseX;
    const y = p.mouseY;
    let inspectedSmallCircleIndex = '';

    Object.entries(this.smallCirclePositions).forEach(
      ([circleIndex, smallCircles]) => {
        smallCircles?.forEach((position, index) => {
          const { x: smallCircleX, y: smallCircleY } = position;
          const smallCircleDiameter = config.timeline.circleProps.diameter / 5;

          if (
            x > smallCircleX - smallCircleDiameter / 2 &&
            x < smallCircleX + smallCircleDiameter / 2 &&
            y > smallCircleY - smallCircleDiameter / 2 &&
            y < smallCircleY + smallCircleDiameter / 2
          ) {
            inspectedSmallCircleIndex = `${circleIndex}-${index}`;
          }
        });
      }
    );

    return inspectedSmallCircleIndex;
  };

  // public methods/API
  public togglePlay = (state?: boolean) => {
    if (this.isInteractive && state === true) {
      this.playing = false;
      return;
    }
    this.playing = state ?? !this.playing;
  };

  public reset = () => {
    this.visitIndex = 0;
    this.inspectedCircleIndex = -1;
    this.circlePositions = {};
    this.smallCirclePositions = {};
    this.prevVisitedCircleIndex = -1;
    this.inspectedCircles.clear();
  };

  public getCurrentVisitIndex = () => {
    return this.visitIndex;
  };

  public updateSpeedMultiplier = (speedMultiplier: number) => {
    this.speedMultiplier = speedMultiplier;
  };

  public start = () => {
    this.p.draw = this.draw;
  };
}

export default TopicsAnimation;

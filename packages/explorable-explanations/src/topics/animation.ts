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
import { getAdtechsColors } from './utils';
import { circle, infoBox, smallCircles } from './components';
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
  counter = 0;
  lastFrameCount = 0;
  inspectedCircles: Set<number> = new Set();
  isTextLoadingCoverVisible = true;

  epoch: TopicsAnimationProps['epoch'];
  isInteractive: TopicsAnimationProps['isInteractive'];
  _handleUserVisit: TopicsAnimationProps['handleUserVisit'];
  setHighlightAdTech: TopicsAnimationProps['setHighlightAdTech'];
  isAnimating: TopicsAnimationProps['isAnimating'];
  visitIndexStart: TopicsAnimationProps['visitIndexStart'];

  constructor({
    p,
    epoch,
    isInteractive,
    siteAdTechs,
    handleUserVisit,
    setHighlightAdTech,
    isAnimating,
    visitIndexStart,
  }: TopicsAnimationProps) {
    this.p = p;
    this.epoch = epoch;
    this.isInteractive = isInteractive;
    this.siteAdTechs = siteAdTechs;
    this._handleUserVisit = handleUserVisit;
    this.setHighlightAdTech = setHighlightAdTech;
    this.isAnimating = isAnimating;
    if (visitIndexStart && isAnimating && !this.isInteractive) {
      this.visitIndex = visitIndexStart;
    }
    p.preload = this.preload;
    p.setup = this.setup;
    p.draw = this.draw;
  }

  preload = () => {
    // TODO: use app.assets for assets
    Object.keys(assets).forEach((key) => {
      this[key] = this.p.loadImage(assets[key]);
    });
  };

  setup = () => {
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
    // events
    this.canvas.mouseClicked(this.mouseClicked);
  };

  start = () => {
    this.p.draw = this.draw;
  };

  draw = () => {
    this.p.background(255); // clear canvas
    this.drawTimeline();
    this.drawCursor();
    this.updateInspectedCircleIndex();

    if (this.isInteractive) {
      this.playing = false;
      this.drawInteractiveMode();
    } else {
      this.incrementVisitIndex();
      this.drawVisitedCircles();
    }
  };

  incrementVisitIndex = () => {
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

  drawVisitedCircles = () => {
    if (this.visitIndex === this.epoch.length) {
      this.playing = false;
    }

    for (let i = 0; i < this.visitIndex; i++) {
      this.handleUserVisit(i);
    }
    this.drawInspectedCircle();
  };

  drawInspectedCircle = () => {
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

    p.push();
    p.fill(255);
    p.stroke(255);
    p.rectMode(p.CENTER);
    p.rect(position.x, position.y + diameter / 2 + 150, 300, 250);
    p.strokeWeight(5);
    p.line(
      position.x,
      position.y + diameter / 2 + 3,
      position.x,
      position.y + 95
    );
    p.pop();
  }

  togglePlay = (state: boolean) => {
    this.playing = state;
  };

  reset = () => {
    this.visitIndex = 0;
    this.inspectedCircleIndex = -1;
    this.circlePositions = {};
    this.smallCirclePositions = {};
    this.counter = 0;
    this.lastFrameCount = 0;
    this.prevVisitedCircleIndex = -1;
    this.inspectedCircles.clear();
  };

  getCurrentVisitIndex = () => {
    return this.visitIndex;
  };

  updateSpeedMultiplier = (speedMultiplier: number) => {
    this.speedMultiplier = speedMultiplier;
  };

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

  drawInfoBox(index: number, currentSite: string) {
    const p = this.p;
    const position = this.circlePositions[index];
    const topics = this.epoch[index].topics;
    const { diameter } = config.timeline.circleProps;
    const adTechs = this.siteAdTechs[currentSite];
    infoBox({ p, position, diameter, topics, adTechs });
  }

  drawSmallCircles(index: number, currentSite: string) {
    const p = this.p;
    const { diameter } = config.timeline.circleProps;
    const smallCircleDiameter = diameter / 5;
    const adTechs = this.siteAdTechs[currentSite];

    const appSmallCirclePositions = this.smallCirclePositions[index];

    // if small circles already exist, just draw them
    if (appSmallCirclePositions) {
      for (let i = 0; i < appSmallCirclePositions.length; i++) {
        const smallCirclePosition = appSmallCirclePositions[i];
        const adTechColor = getAdtechsColors(p)[adTechs[i]];

        p.push();
        p.fill(adTechColor);
        p.circle(
          smallCirclePosition.x,
          smallCirclePosition.y,
          smallCircleDiameter
        );
        p.pop();
      }
      return;
    }

    const position = this.circlePositions[index];
    const smallCirclePositions: { x: number; y: number }[] = [];
    const distanceFromEdge = 6;
    const numSmallCircles = adTechs.length;

    for (let i = 0; i < numSmallCircles; i++) {
      let randomX: number, randomY: number, isOverlapping: boolean;

      do {
        const angle = Math.random() * 2 * Math.PI;

        randomX =
          position.x + (diameter / 2 + distanceFromEdge) * Math.cos(angle);
        randomY =
          position.y + (diameter / 2 + distanceFromEdge) * Math.sin(angle);

        // eslint-disable-next-line no-loop-func
        isOverlapping = smallCirclePositions.some((pos) => {
          const dx = pos.x - randomX;
          const dy = pos.y - randomY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          return distance < smallCircleDiameter;
        });

        const circleCircleDistanceX = Math.abs(position.x - randomX);
        const circleCircleDistanceY = Math.abs(position.y - randomY);

        isOverlapping =
          isOverlapping ||
          circleCircleDistanceX <= smallCircleDiameter ||
          circleCircleDistanceY <= smallCircleDiameter;
      } while (isOverlapping);

      smallCirclePositions.push({ x: randomX, y: randomY });

      const adTechColor = getAdtechsColors(p)[adTechs[i]];

      p.push();
      p.fill(adTechColor);
      p.circle(randomX, randomY, smallCircleDiameter);
      p.pop();
    }

    this.smallCirclePositions[index] = smallCirclePositions;
  }

  drawCircle = (index: number, visited?: boolean) => {
    const p = this.p;
    const position = this.circlePositions[index];
    const { diameter } = config.timeline.circleProps;

    if (!this.completedIcon) {
      return;
    }

    circle({
      p,
      position,
      visited: Boolean(visited),
      completedIcon: this.completedIcon,
      diameter,
    });
  };

  drawTimeline = () => {
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

  drawCursor = () => {
    const p = this.p;
    if (this.showHandCursor) {
      p.cursor(p.HAND);
    } else {
      p.cursor(p.ARROW);
    }
  };

  drawInteractiveMode = () => {
    const p = this.p;
    const x = p.mouseX;
    const y = p.mouseY;
    const user = config.timeline.user;

    this.showHandCursor = false;
    const isInspectingCircle = this.inspectedCircleIndex !== -1;
    const isInspectingSmallCircle = this.inspectedSmallCircleIndex !== '';
    const isInspecting = isInspectingCircle || isInspectingSmallCircle;

    const lastVisitedIndex = this.prevVisitedCircleIndex;
    // draw visited circles
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

    if (
      isInspecting &&
      this.inspectedCircleIndex !== this.prevVisitedCircleIndex
    ) {
      this.showHandCursor = true;
    }

    if (
      !isInspecting ||
      !this.inspectedCircles.has(this.inspectedCircleIndex)
    ) {
      p.image(
        this.userIcon as p5.Image,
        x - user.width / 2,
        y - user.height / 2,
        user.width,
        user.height
      );
    }
  };

  updateInspectedCircleIndex = () => {
    if (this.playing) {
      return;
    }

    const p = this.p;
    const x = p.mouseX;
    const y = p.mouseY;

    this.inspectedCircleIndex = -1;
    this.inspectedSmallCircleIndex = '';

    // update inspected circle index
    Object.values(this.circlePositions).forEach((position, index) => {
      const { diameter } = config.timeline.circleProps;
      const { x: circleX, y: circleY } = position;

      if (
        x > circleX - diameter / 2 &&
        x < circleX + diameter / 2 &&
        y > circleY - diameter / 2 &&
        y < circleY + diameter / 2
      ) {
        this.inspectedCircleIndex = index;
      }
    });

    // update inspected small circle index
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
            this.inspectedSmallCircleIndex = `${circleIndex}-${index}`;
          }
        });
      }
    );
  };
}

export default TopicsAnimation;

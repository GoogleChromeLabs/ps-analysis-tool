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
  prevVisitedCircleIndex = -1;
  showHandCursor = false;
  canvas: p5.Renderer | null = null;
  smallCirclePositions: Record<number, { x: number; y: number }[]> = {};
  counter = 0;
  lastFrameCount = 0;
  inspectedCircles: Set<number> = new Set();
  isTextLoadingCoverVisible = true;

  // props
  epoch: { datetime: string; website: string; topics: string[] }[] = [];
  isInteractive = false;
  _handleUserVisit: (visitIndex: number) => void;
  setHighlightAdTech: (highlightAdTech: string | null) => void;

  constructor(
    p: p5,
    epoch: { datetime: string; website: string; topics: string[] }[],
    isInteractive: boolean,
    siteAdTechs: Record<string, string[]>,
    handleUserVisit: (visitIndex: number) => void,
    setHighlightAdTech: (highlightAdTech: string | null) => void
  ) {
    this.p = p;
    this.epoch = epoch;
    this.isInteractive = isInteractive;
    this.siteAdTechs = siteAdTechs;
    this._handleUserVisit = handleUserVisit;
    this.setHighlightAdTech = setHighlightAdTech;
  }

  drawTimeline(
    position: { x: number; y: number },
    circles: { datetime: string; website: string; topics: string[] }[]
  ) {
    const p = this.p;
    const { diameter, horizontalSpacing } = config.timeline.circleProps;
    const circleVerticalSpace = horizontalSpacing - 30 + diameter;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);

    circles.forEach((circleItem, index) => {
      const xPosition = horizontalSpacing + circleVerticalSpace * index;

      if (!this.circlePositions) {
        this.circlePositions = {};
      }

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
  }

  drawCircle(index: number, visited?: boolean) {
    const p = this.p;
    const position = this.circlePositions[index];
    const { diameter } = config.timeline.circleProps;

    p.push();

    if (visited) {
      p.stroke('#1A73E8');
    }

    p.circle(position.x, position.y, diameter);

    if (visited) {
      const user = config.timeline.user;

      p.image(
        this.completedIcon as p5.Image,
        position.x - user.width / 2,
        position.y - user.height / 2,
        user.width,
        user.height
      );
    }

    p.pop();
  }

  play() {
    this.handleUserVisit(this.visitIndex);

    if (this.visitIndex === this.epoch.length) {
      this.playing = false;
      return;
    }

    this.visitIndex++;
  }

  togglePlay(state: boolean) {
    this.playing = state;

    if (
      !this.playing &&
      this.visitIndex > 0 &&
      this.visitIndex <= this.epoch.length
    ) {
      this.drawCircle(this.visitIndex - 1, true);
      this.drawInfoBox(
        this.visitIndex - 1,
        this.epoch[this.visitIndex - 1].website
      );
      this.inspectedCircleIndex = this.visitIndex - 1;
    } else if (this.playing && this.inspectedCircleIndex !== -1) {
      this.resetInfoBox(this.inspectedCircleIndex);
      this.inspectedCircleIndex = -1;
    }
  }

  reset() {
    const p = this.p;
    this.visitIndex = 0;
    this.inspectedCircleIndex = -1;
    this.circlePositions = {};
    this.smallCirclePositions = {};
    this.counter = 0;
    this.lastFrameCount = 0;
    this.prevVisitedCircleIndex = -1;
    this.inspectedCircles.clear();
    p?.clear();
    p.background(255);
    p.pixelDensity(2);
    this.drawTimeline(config.timeline.position, this.epoch);
  }

  getCurrentVisitIndex() {
    return this.visitIndex;
  }

  updateSpeedMultiplier(speedMultiplier: number) {
    this.speedMultiplier = speedMultiplier;
  }

  userVisitDone(index: number) {
    this.resetInfoBox(index);
    this.drawCircle(index, true);
  }

  handleUserVisit(visitIndex: number) {
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

  drawInfoBox(index: number, currentSite: string) {
    const p = this.p;
    const position = this.circlePositions[index];
    const topics = this.epoch[index].topics;
    const { diameter } = config.timeline.circleProps;

    p.push();
    p.rectMode(p.CENTER);
    p.fill(245);
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(
      position.x,
      position.y + diameter / 2 + 150,
      280,
      200,
      10,
      10,
      10,
      10
    );

    p.stroke(255);
    p.strokeWeight(1);
    p.fill(0);
    p.textSize(12);
    p.textAlign(p.LEFT, p.CENTER);
    p.textStyle(p.BOLD);
    p.text(
      'Topic(s) Observed:',
      position.x - 120,
      position.y + diameter / 2 + 75
    );
    p.textStyle(p.NORMAL);
    topics.forEach((topic, i) => {
      const _topic = topic.split('/').slice(-1)[0];
      p.text(_topic, position.x - 115, position.y + diameter / 2 + 95 + i * 20);
    });

    const startingPointAdTechs = topics.length * 20 + 20;

    const adTechs = this.siteAdTechs[currentSite];
    const numAdTechs = adTechs.length;

    p.textStyle(p.BOLD);
    p.text(
      'Observed-by Context Domain(s):',
      position.x - 120,
      position.y + diameter / 2 + 85 + startingPointAdTechs
    );
    p.textStyle(p.NORMAL);
    for (let i = 0; i < numAdTechs; i++) {
      const adTech = adTechs[i];
      const adTechColor = getAdtechsColors(p)[adTech];

      p.fill(adTechColor);
      p.stroke(0);
      p.circle(
        position.x - 110,
        position.y + diameter / 2 + 105 + i * 20 + startingPointAdTechs,
        diameter / 5
      );

      p.fill(0);
      p.stroke(255);
      p.text(
        adTech,
        position.x - 85,
        position.y + diameter / 2 + 105 + i * 20 + startingPointAdTechs
      );
    }

    p.stroke(0);
    p.line(
      position.x,
      position.y + diameter / 2 + 1,
      position.x,
      position.y + 75
    );

    p.pop();
  }

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

  mouseMoved() {
    const p = this.p;
    if (this.playing) {
      return;
    }

    const x = p.mouseX;
    const y = p.mouseY;

    let isInspecting = false;
    let lastInspectedIndex = -1;

    Object.values(this.circlePositions).forEach((position, index) => {
      const { diameter } = config.timeline.circleProps;
      const { x: circleX, y: circleY } = position;

      if (
        x > circleX - diameter / 2 &&
        x < circleX + diameter / 2 &&
        y > circleY - diameter / 2 &&
        y < circleY + diameter / 2
      ) {
        lastInspectedIndex = index;

        if (this.visitIndex <= index) {
          if (this.isInteractive) {
            this.showHandCursor = true;
            isInspecting = true;
          }

          if (this.inspectedCircleIndex !== -1) {
            this.resetInfoBox(this.inspectedCircleIndex);
            this.inspectedCircleIndex = -1;
          }

          return;
        }

        if (
          this.inspectedCircleIndex !== -1 &&
          this.inspectedCircleIndex !== index
        ) {
          this.resetInfoBox(this.inspectedCircleIndex);
        }

        this.drawInfoBox(index, this.epoch[index].website);
        this.inspectedCircleIndex = index;
      }
    });

    Object.values(this.smallCirclePositions).forEach((smallCircles) => {
      smallCircles?.forEach((position) => {
        const { x: smallCircleX, y: smallCircleY } = position;
        const smallCircleDiameter = config.timeline.circleProps.diameter / 5;

        if (
          x > smallCircleX - smallCircleDiameter / 2 &&
          x < smallCircleX + smallCircleDiameter / 2 &&
          y > smallCircleY - smallCircleDiameter / 2 &&
          y < smallCircleY + smallCircleDiameter / 2
        ) {
          this.showHandCursor = true;
          isInspecting = true;
        }
      });
    });

    if (!isInspecting) {
      this.showHandCursor = false;
    }

    if (this.isInteractive) {
      const user = config.timeline.user;
      p.push();
      p.clear();

      this.drawTimeline(config.timeline.position, this.epoch);
      const lastVisitedIndex = this.prevVisitedCircleIndex;
      if (lastVisitedIndex !== -1) {
        // keep track of visited circles
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
        this.drawInfoBox(
          lastVisitedIndex,
          this.epoch[lastVisitedIndex].website
        );
      }

      // drag user icon only if not hovering the current selected circle
      if (!isInspecting || lastInspectedIndex !== this.prevVisitedCircleIndex) {
        p.image(
          this.userIcon as p5.Image,
          x - user.width / 2,
          y - user.height / 2,
          user.width,
          user.height
        );
      }

      if (isInspecting && lastInspectedIndex === this.prevVisitedCircleIndex) {
        this.showHandCursor = false;
      }

      p.pop();
    }
  }

  mouseClicked() {
    const p = this.p;
    if (this.playing) {
      return;
    }

    const x = p.mouseX;
    const y = p.mouseY;

    if (this.isInteractive) {
      Object.values(this.circlePositions).forEach((position, index) => {
        const { diameter } = config.timeline.circleProps;
        const { x: circleX, y: circleY } = position;

        if (
          x > circleX - diameter / 2 &&
          x < circleX + diameter / 2 &&
          y > circleY - diameter / 2 &&
          y < circleY + diameter / 2
        ) {
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
      });
      this.mouseMoved();
    }

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
            this.setHighlightAdTech(
              this.siteAdTechs[this.epoch[Number(circleIndex)].website][index]
            );
          }
        });
      }
    );
  }
}

export default TopicsAnimation;

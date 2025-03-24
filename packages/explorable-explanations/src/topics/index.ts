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
import type p5 from 'p5';

/**
 * Internal dependencies
 */
import { config } from './config';
import { getAdtechsColors } from './utils';
import { websitesToIconsMapping } from './data';
import icons from '../icons.json';

/**
 * Setup function for p5.js
 * @param p - p5.js instance
 * @param epoch - Array of objects containing datetime, website, and topics
 * @param isAnimating - Boolean to tell if the animation should play
 * @param siteAdTechs - Object with websites as keys and adtechs as values
 * @param visitIndexStart - Index to start the animation from
 * @param handleUserVisit - Callback function for letting the parent component know when a user visit is happening
 * @param setHighlightAdTech - Callback function for setting the highlighted adtech
 * @param isInteractive - Boolean to tell if the animation should be interactive
 * @returns Object with callbacks to control the animation
 */
export function topicsAnimation(
  p: p5,
  epoch: { datetime: string; website: string; topics: string[] }[],
  isAnimating: boolean,
  siteAdTechs: Record<string, string[]>,
  visitIndexStart: number,
  handleUserVisit: (visitIndex: number) => void,
  setHighlightAdTech: (highlightAdTech: string | null) => void,
  isInteractive: boolean
) {
  const app = {
    userIcon: null as p5.Image | null,
    completedIcon: null as p5.Image | null,
    'tmz.com': null as p5.Image | null,
    'cnet.com': null as p5.Image | null,
    'espn.com': null as p5.Image | null,
    'investopedia.com': null as p5.Image | null,
    'tripadvisor.com': null as p5.Image | null,
    'allrecipes.com': null as p5.Image | null,
    'vogue.com': null as p5.Image | null,
    'bloomberg.com': null as p5.Image | null,
    'linkedin.com': null as p5.Image | null,
    'rollingstone.com': null as p5.Image | null,
    'cnn.com': null as p5.Image | null,
    'techcrunch.com': null as p5.Image | null,
    'cbssports.com': null as p5.Image | null,
    'healthline.com': null as p5.Image | null,
    'expedia.com': null as p5.Image | null,
    'foodnetwork.com': null as p5.Image | null,
    'cosmopolitan.com': null as p5.Image | null,
    'nerdwallet.com': null as p5.Image | null,
    'indeed.com': null as p5.Image | null,
    'crunchyroll.com': null as p5.Image | null,
    circlePositions: {} as Record<number, { x: number; y: number }>,
    siteAdTechs: {} as Record<string, string[]>,
    visitIndex: 0,
    playing: true,
    speedMultiplier: 1,
    inspectedCircleIndex: -1,
    prevVisitedCircleIndex: -1,
    showHandCursor: false,
    canvas: null as p5.Renderer | null,
    smallCirclePositions: {} as Record<number, { x: number; y: number }[]>,
    counter: 0,
    lastFrameCount: 0,
    inspectedCircles: new Set<number>(),
    isTextLoadingCoverVisible: true,

    drawTimeline: (
      position: { x: number; y: number },
      circles: { datetime: string; website: string; topics: string[] }[]
    ) => {
      const { diameter, horizontalSpacing } = config.timeline.circleProps;
      const circleVerticalSpace = horizontalSpacing - 30 + diameter;

      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);

      circles.forEach((circleItem, index) => {
        const xPosition = horizontalSpacing + circleVerticalSpace * index;

        if (!app.circlePositions) {
          app.circlePositions = {};
        }

        if (app?.[circleItem.website]) {
          p.image(
            app[circleItem.website],
            xPosition - diameter / 4 - 3,
            55,
            diameter / 2 + 8,
            diameter / 2 + 8
          );
        }

        p.text(circleItem.website, xPosition, position.y - 70);

        p.line(xPosition, position.y - 50, xPosition, position.y);

        app.circlePositions[index] = { x: xPosition, y: position.y };
        app.drawCircle(index);
      });
    },

    drawCircle: (index: number, visited?: boolean) => {
      const position = app.circlePositions[index];
      const { diameter } = config.timeline.circleProps;

      p.push();

      if (visited) {
        p.stroke('#1A73E8');
      }

      p.circle(position.x, position.y, diameter);

      if (visited) {
        const user = config.timeline.user;

        p.image(
          app.completedIcon as p5.Image,
          position.x - user.width / 2,
          position.y - user.height / 2,
          user.width,
          user.height
        );
      }

      p.pop();
    },

    play: () => {
      app.handleUserVisit(app.visitIndex);

      if (app.visitIndex === epoch.length) {
        app.playing = false;
        return;
      }

      app.visitIndex++;
    },

    togglePlay: (state: boolean) => {
      app.playing = state;

      if (
        !app.playing &&
        app.visitIndex > 0 &&
        app.visitIndex <= epoch.length
      ) {
        app.drawCircle(app.visitIndex - 1, true);
        app.drawInfoBox(app.visitIndex - 1, epoch[app.visitIndex - 1].website);
        app.inspectedCircleIndex = app.visitIndex - 1;
      } else if (app.playing && app.inspectedCircleIndex !== -1) {
        app.resetInfoBox(app.inspectedCircleIndex);
        app.inspectedCircleIndex = -1;
      }
    },

    reset: () => {
      app.visitIndex = 0;
      app.inspectedCircleIndex = -1;
      app.circlePositions = {};
      app.smallCirclePositions = {};
      app.counter = 0;
      app.lastFrameCount = 0;
      app.prevVisitedCircleIndex = -1;
      app.inspectedCircles.clear();
      p?.clear();
      p.background(255);
      p.pixelDensity(2);
      app.drawTimeline(config.timeline.position, epoch);
    },

    getCurrentVisitIndex: () => app.visitIndex,

    updateSpeedMultiplier: (speedMultiplier: number) => {
      app.speedMultiplier = speedMultiplier;
    },

    userVisitDone: (index: number) => {
      app.resetInfoBox(index);
      app.drawCircle(index, true);
    },

    handleUserVisit: (visitIndex: number, calculate = true) => {
      if (visitIndex > 0 && !isInteractive) {
        app.userVisitDone(visitIndex - 1);
      }

      if (visitIndex >= epoch.length) {
        if (visitIndex === epoch.length) {
          if (calculate) {
            handleUserVisit(visitIndex);
          }
        }

        return;
      }

      const circlePosition = app.circlePositions[visitIndex];

      if (circlePosition === undefined) {
        return;
      }

      const user = config.timeline.user;

      p.image(
        app.userIcon as p5.Image,
        circlePosition.x - user.width / 2,
        circlePosition.y - user.height / 2,
        user.width,
        user.height
      );

      const position = app.circlePositions[visitIndex];
      const previousPosition =
        app.circlePositions?.[visitIndex - 1] || config.timeline.position;
      const circleDiameter = config.timeline.circleProps.diameter;
      const { diameter, horizontalSpacing } = config.timeline.circleProps;
      const circleVerticalSpace = horizontalSpacing - 30 + diameter;
      const xPosition = horizontalSpacing + circleVerticalSpace * visitIndex;
      const currentCircle = epoch[visitIndex];

      if (!isInteractive) {
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
      app.drawInfoBox(visitIndex, currentSite);
      app.drawSmallCircles(visitIndex, currentSite);

      if (calculate) {
        handleUserVisit(visitIndex);
      }
    },

    drawSmallCircles: (index: number, currentSite: string) => {
      const { diameter } = config.timeline.circleProps;
      const smallCircleDiameter = diameter / 5;
      const adTechs = siteAdTechs[currentSite];

      const appSmallCirclePositions = app.smallCirclePositions[index];

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

      const position = app.circlePositions[index];
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

      app.smallCirclePositions[index] = smallCirclePositions;
    },

    drawInfoBox: (index: number, currentSite: string) => {
      const position = app.circlePositions[index];
      const topics = epoch[index].topics;
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
        p.text(
          _topic,
          position.x - 115,
          position.y + diameter / 2 + 95 + i * 20
        );
      });

      const startingPointAdTechs = topics.length * 20 + 20;

      const adTechs = siteAdTechs[currentSite];
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
    },

    resetInfoBox: (index: number) => {
      const position = app.circlePositions[index];
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
    },

    mouseMoved: () => {
      if (app.playing) {
        return;
      }

      const x = p.mouseX;
      const y = p.mouseY;

      let isInspecting = false;
      let lastInspectedIndex = -1;

      Object.values(app.circlePositions).forEach((position, index) => {
        const { diameter } = config.timeline.circleProps;
        const { x: circleX, y: circleY } = position;

        if (
          x > circleX - diameter / 2 &&
          x < circleX + diameter / 2 &&
          y > circleY - diameter / 2 &&
          y < circleY + diameter / 2
        ) {
          lastInspectedIndex = index;

          if (app.visitIndex <= index) {
            if (isInteractive) {
              app.showHandCursor = true;
              isInspecting = true;
            }

            if (app.inspectedCircleIndex !== -1) {
              app.resetInfoBox(app.inspectedCircleIndex);
              app.inspectedCircleIndex = -1;
            }

            return;
          }

          if (
            app.inspectedCircleIndex !== -1 &&
            app.inspectedCircleIndex !== index
          ) {
            app.resetInfoBox(app.inspectedCircleIndex);
          }

          app.drawInfoBox(index, epoch[index].website);
          app.inspectedCircleIndex = index;
        }
      });

      Object.values(app.smallCirclePositions).forEach((smallCircles) => {
        smallCircles?.forEach((position) => {
          const { x: smallCircleX, y: smallCircleY } = position;
          const smallCircleDiameter = config.timeline.circleProps.diameter / 5;

          if (
            x > smallCircleX - smallCircleDiameter / 2 &&
            x < smallCircleX + smallCircleDiameter / 2 &&
            y > smallCircleY - smallCircleDiameter / 2 &&
            y < smallCircleY + smallCircleDiameter / 2
          ) {
            app.showHandCursor = true;
            isInspecting = true;
          }
        });
      });

      if (!isInspecting) {
        app.showHandCursor = false;
      }

      if (isInteractive) {
        const user = config.timeline.user;
        p.push();
        p.clear();

        app.drawTimeline(config.timeline.position, epoch);
        const lastVisitedIndex = app.prevVisitedCircleIndex;
        if (lastVisitedIndex !== -1) {
          // keep track of visited circles
          app.inspectedCircles.add(lastVisitedIndex);

          const inspectedCirclesArray = Array.from(app.inspectedCircles);
          for (let i = 0; i < inspectedCirclesArray.length; i++) {
            const index = inspectedCirclesArray[i];
            if (lastVisitedIndex === index) {
              app.handleUserVisit(index, false);
            } else {
              app.userVisitDone(index);
            }
            app.drawSmallCircles(index, epoch[index].website);
          }
          app.drawInfoBox(lastVisitedIndex, epoch[lastVisitedIndex].website);
        }

        // drag user icon only if not hovering the current selected circle
        if (
          !isInspecting ||
          lastInspectedIndex !== app.prevVisitedCircleIndex
        ) {
          p.image(
            app.userIcon as p5.Image,
            x - user.width / 2,
            y - user.height / 2,
            user.width,
            user.height
          );
        }

        if (isInspecting && lastInspectedIndex === app.prevVisitedCircleIndex) {
          app.showHandCursor = false;
        }

        p.pop();
      }
    },

    mouseClicked: () => {
      if (app.playing) {
        return;
      }

      const x = p.mouseX;
      const y = p.mouseY;

      if (isInteractive) {
        Object.values(app.circlePositions).forEach((position, index) => {
          const { diameter } = config.timeline.circleProps;
          const { x: circleX, y: circleY } = position;

          if (
            x > circleX - diameter / 2 &&
            x < circleX + diameter / 2 &&
            y > circleY - diameter / 2 &&
            y < circleY + diameter / 2
          ) {
            if (app.prevVisitedCircleIndex === index) {
              return;
            }

            if (app.prevVisitedCircleIndex !== -1) {
              app.userVisitDone(app.prevVisitedCircleIndex);
            }

            if (app.smallCirclePositions[index] === undefined) {
              app.handleUserVisit(index);
            } else {
              app.drawInfoBox(index, epoch[index].website);
            }
            app.prevVisitedCircleIndex = index;
          }
        });
        app.mouseMoved();
      }

      Object.entries(app.smallCirclePositions).forEach(
        ([circleIndex, smallCircles]) => {
          smallCircles?.forEach((position, index) => {
            const { x: smallCircleX, y: smallCircleY } = position;
            const smallCircleDiameter =
              config.timeline.circleProps.diameter / 5;

            if (
              x > smallCircleX - smallCircleDiameter / 2 &&
              x < smallCircleX + smallCircleDiameter / 2 &&
              y > smallCircleY - smallCircleDiameter / 2 &&
              y < smallCircleY + smallCircleDiameter / 2
            ) {
              setHighlightAdTech(
                siteAdTechs[epoch[Number(circleIndex)].website][index]
              );
            }
          });
        }
      );
    },
  };

  p.preload = () => {
    app.userIcon = p.loadImage(icons.user);
    app.completedIcon = p.loadImage(icons.completedCheckMark);

    app['tmz.com'] = p.loadImage(websitesToIconsMapping['tmz.com']);
    app['cnet.com'] = p.loadImage(websitesToIconsMapping['cnet.com']);
    app['espn.com'] = p.loadImage(websitesToIconsMapping['espn.com']);
    app['investopedia.com'] = p.loadImage(
      websitesToIconsMapping['investopedia.com']
    );
    app['tripadvisor.com'] = p.loadImage(
      websitesToIconsMapping['tripadvisor.com']
    );
    app['allrecipes.com'] = p.loadImage(
      websitesToIconsMapping['allrecipes.com']
    );
    app['vogue.com'] = p.loadImage(websitesToIconsMapping['vogue.com']);
    app['bloomberg.com'] = p.loadImage(websitesToIconsMapping['bloomberg.com']);
    app['linkedin.com'] = p.loadImage(websitesToIconsMapping['linkedin.com']);
    app['rollingstone.com'] = p.loadImage(
      websitesToIconsMapping['rollingstone.com']
    );
    app['cnn.com'] = p.loadImage(websitesToIconsMapping['cnn.com']);
    app['techcrunch.com'] = p.loadImage(
      websitesToIconsMapping['techcrunch.com']
    );
    app['cbssports.com'] = p.loadImage(websitesToIconsMapping['cbssports.com']);
    app['healthline.com'] = p.loadImage(
      websitesToIconsMapping['healthline.com']
    );
    app['expedia.com'] = p.loadImage(websitesToIconsMapping['expedia.com']);
    app['foodnetwork.com'] = p.loadImage(
      websitesToIconsMapping['foodnetwork.com']
    );
    app['cosmopolitan.com'] = p.loadImage(
      websitesToIconsMapping['cosmopolitan.com']
    );
    app['nerdwallet.com'] = p.loadImage(
      websitesToIconsMapping['nerdwallet.com']
    );
    app['indeed.com'] = p.loadImage(websitesToIconsMapping['indeed.com']);
    app['crunchyroll.com'] = p.loadImage(
      websitesToIconsMapping['crunchyroll.com']
    );
  };

  p.setup = () => {
    const circleHorizontalSpace =
      config.timeline.circleProps.horizontalSpacing +
      config.timeline.circleProps.diameter;
    app.canvas = p.createCanvas(
      circleHorizontalSpace * 6,
      config.canvas.height
    );
    p.background(255);
    p.pixelDensity(2);
    app.canvas.mouseMoved(app.mouseMoved);
    app.canvas.mouseClicked(app.mouseClicked);

    p.textFont('sans-serif');
    app.drawTimeline(config.timeline.position, epoch);

    if (!isAnimating && !isInteractive) {
      while (app.visitIndex < epoch.length) {
        app.play();
      }
      app.userVisitDone(app.visitIndex - 1);
      app.inspectedCircleIndex = app.visitIndex - 1;
      app.drawInfoBox(app.visitIndex - 1, epoch[app.visitIndex - 1].website);
    }

    if (visitIndexStart > 0 && !isInteractive) {
      while (app.visitIndex < visitIndexStart) {
        app.play();
      }
      app.inspectedCircleIndex = visitIndexStart - 1;
    }

    // permanently remove the loading text cover if visible
    // to allow hovering that area
    if (app.isTextLoadingCoverVisible) {
      try {
        document.getElementById('loading-text-cover')?.remove();
      } catch (error) {
        // ignore error
      }
      app.isTextLoadingCoverVisible = false;
    }
  };

  p.draw = () => {
    if (app.counter < 50) {
      app.counter++;
      app.lastFrameCount = p.frameCount;
      return;
    }

    const step = config.timeline.stepDelay / app.speedMultiplier;
    const delay = step / 10;

    if (app.showHandCursor) {
      p.cursor(p.HAND);
    } else {
      p.cursor(p.ARROW);
    }

    if (
      ((p.frameCount - app.lastFrameCount) % delay === 0 ||
        app.visitIndex === 0) &&
      app.playing &&
      !isInteractive
    ) {
      app.play();
    }

    if (isInteractive && app.playing) {
      app.playing = false;
    }
  };

  return {
    togglePlay: app.togglePlay,
    reset: app.reset,
    updateSpeedMultiplier: app.updateSpeedMultiplier,
    getCurrentVisitIndex: app.getCurrentVisitIndex,
  };
}

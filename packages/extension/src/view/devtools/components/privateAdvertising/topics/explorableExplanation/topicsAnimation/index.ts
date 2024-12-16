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

import type p5 from 'p5';
import { config } from './config';
import { getAdtechsColors } from './utils';

/**
 * Setup function for p5.js
 * @param p - p5.js instance
 * @param epoch - Array of objects containing datetime, website, and topics
 * @param isAnimating - Boolean to tell if the animation should play
 * @param siteAdTechs - Object with websites as keys and adtechs as values
 * @param visitIndexStart - Index to start the animation from
 * @param handleUserVisit - Callback function for letting the parent component know when a user visit is happening
 * @param setHighlightAdTech - Callback function for setting the highlighted adtech
 * @returns Object with callbacks to control the animation
 */
export function topicsAnimation(
  p: p5,
  epoch: { datetime: string; website: string; topics: string[] }[],
  isAnimating: boolean,
  siteAdTechs: Record<string, string[]>,
  visitIndexStart: number,
  handleUserVisit: (visitIndex: number) => void,
  setHighlightAdTech: (highlightAdTech: string | null) => void
) {
  const app = {
    userIcon: null as p5.Image | null,
    completedIcon: null as p5.Image | null,
    circlePositions: [] as { x: number; y: number }[],
    siteAdTechs: {} as Record<string, string[]>,
    visitIndex: 0,
    playing: true,
    speedMultiplier: 1,
    inspectedCircleIndex: -1,
    canvas: null as p5.Renderer | null,
    smallCirclePositions: {} as Record<number, { x: number; y: number }[]>,

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
          app.circlePositions = [];
        }

        p.text(circleItem.website, xPosition, 50);

        p.line(
          xPosition,
          position.y - diameter / 2,
          xPosition,
          position.y - 50
        );

        app.circlePositions.push({ x: xPosition, y: position.y });
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
        app.userVisitDone(app.visitIndex - 1);
      } else if (app.playing && app.inspectedCircleIndex !== -1) {
        app.resetInfoBox(app.inspectedCircleIndex);
        app.inspectedCircleIndex = -1;
      }
    },

    reset: () => {
      app.visitIndex = 0;
      app.speedMultiplier = 1;
      app.inspectedCircleIndex = -1;
      p?.clear();
      p.background(245);
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

    handleUserVisit: (visitIndex: number) => {
      if (visitIndex > 0) {
        app.userVisitDone(visitIndex - 1);
      }

      if (visitIndex >= epoch.length) {
        if (visitIndex === epoch.length) {
          handleUserVisit(visitIndex);
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

      p.push();
      p.text(currentCircle.datetime, xPosition, 30);
      p.stroke('#1A73E8');
      p.line(
        previousPosition.x + (visitIndex !== 0 ? circleDiameter / 2 : 0),
        previousPosition.y,
        position.x - circleDiameter / 2,
        position.y
      );
      p.pop();

      const currentSite = currentCircle.website;
      app.drawInfoBox(visitIndex, currentSite);
      app.drawSmallCircles(visitIndex, currentSite);

      handleUserVisit(visitIndex);
    },

    drawSmallCircles: (index: number, currentSite: string) => {
      const position = app.circlePositions[index];
      const { diameter } = config.timeline.circleProps;
      const smallCircleDiameter = diameter / 5;

      const distanceFromEdge = 6;

      const adTechs = siteAdTechs[currentSite];
      const numSmallCircles = adTechs.length;

      const smallCirclePositions = [];

      for (let i = 0; i < numSmallCircles; i++) {
        let randomX: number, randomY: number, isOverlapping;

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

        // @ts-ignore
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
      p.fill(225);
      p.stroke(255);
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

      p.fill(0);
      p.textSize(12);
      p.textAlign(p.LEFT, p.CENTER);
      p.textStyle(p.BOLD);
      p.text(
        'Topic(s) observed:',
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
        'Observed-by context domain(s):',
        position.x - 120,
        position.y + diameter / 2 + 85 + startingPointAdTechs
      );
      p.textStyle(p.NORMAL);
      for (let i = 0; i < numAdTechs; i++) {
        const adTech = adTechs[i];
        // @ts-ignore
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
      p.fill(245);
      p.stroke(245);
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

      const x = p.mouseX,
        y = p.mouseY;

      app.circlePositions.forEach((position, index) => {
        const { diameter } = config.timeline.circleProps;
        const { x: circleX, y: circleY } = position;

        if (
          x > circleX - diameter / 2 &&
          x < circleX + diameter / 2 &&
          y > circleY - diameter / 2 &&
          y < circleY + diameter / 2
        ) {
          if (
            app.inspectedCircleIndex !== -1 &&
            app.inspectedCircleIndex !== index
          ) {
            app.resetInfoBox(app.inspectedCircleIndex);
          }

          if (app.visitIndex <= index) {
            app.inspectedCircleIndex = -1;
            return;
          }

          if (app.inspectedCircleIndex === index) {
            return;
          }

          app.drawInfoBox(index, epoch[index].website);
          app.inspectedCircleIndex = index;
        }
      });
    },

    mouseClicked: () => {
      if (app.playing) {
        return;
      }

      const x = p.mouseX,
        y = p.mouseY;

      app.smallCirclePositions[app.inspectedCircleIndex]?.forEach(
        (position, index) => {
          const { x: smallCircleX, y: smallCircleY } = position;
          const smallCircleDiameter = config.timeline.circleProps.diameter / 5;

          if (
            x > smallCircleX - smallCircleDiameter / 2 &&
            x < smallCircleX + smallCircleDiameter / 2 &&
            y > smallCircleY - smallCircleDiameter / 2 &&
            y < smallCircleY + smallCircleDiameter / 2
          ) {
            setHighlightAdTech(
              siteAdTechs[epoch[app.inspectedCircleIndex].website][index]
            );
          }
        }
      );
    },
  };

  p.preload = () => {
    app.userIcon = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg=='
    );
    app.completedIcon = p.loadImage(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDhweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSI0OHB4IiBmaWxsPSIjNTk4NUUxIj48cGF0aCBkPSJNNDgwLTgwcS04NSAwLTE1OC0zMC41VDE5NS0xOTVxLTU0LTU0LTg0LjUtMTI3VDgwLTQ4MHEwLTg0IDMwLjUtMTU3VDE5NS03NjRxNTQtNTQgMTI3LTg1dDE1OC0zMXE3NSAwIDE0MCAyNHQxMTcgNjZsLTQzIDQzcS00NC0zNS05OC01NHQtMTE2LTE5cS0xNDUgMC0yNDIuNSA5Ny41VDE0MC00ODBxMCAxNDUgOTcuNSAyNDIuNVQ0ODAtMTQwcTE0NSAwIDI0Mi41LTk3LjVUODIwLTQ4MHEwLTMwLTQuNS01OC41VDgwMi01OTRsNDYtNDZxMTYgMzcgMjQgNzd0OCA4M3EwIDg1LTMxIDE1OHQtODUgMTI3cS01NCA1NC0xMjcgODQuNVQ0ODAtODBabS01OS0yMThMMjU2LTQ2NGw0NS00NSAxMjAgMTIwIDQxNC00MTQgNDYgNDUtNDYwIDQ2MFoiLz48L3N2Zz4='
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
    p.background(245);
    app.canvas.mouseMoved(app.mouseMoved);
    app.canvas.mouseClicked(app.mouseClicked);

    p.textFont('sans-serif');
    app.drawTimeline(config.timeline.position, epoch);

    if (!isAnimating) {
      while (app.visitIndex < epoch.length) {
        app.play();
      }
      app.userVisitDone(app.visitIndex - 1);
    }

    if (visitIndexStart > 0) {
      while (app.visitIndex < visitIndexStart) {
        app.play();
      }
    }
  };

  p.draw = () => {
    const step = config.timeline.stepDelay / app.speedMultiplier;
    const delay = step / 10;

    if (p.frameCount % delay === 0 && app.playing) {
      app.play();
    }
  };

  return {
    togglePlay: app.togglePlay,
    reset: app.reset,
    updateSpeedMultiplier: app.updateSpeedMultiplier,
    getCurrentVisitIndex: app.getCurrentVisitIndex,
  };
}

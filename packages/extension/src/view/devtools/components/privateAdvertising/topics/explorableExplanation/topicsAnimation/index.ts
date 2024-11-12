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
 * @param handleUserVisit - Callback function for letting the parent component know when a user visit is happening
 * @returns Object with callbacks to control the animation
 */
export function topicsAnimation(
  p: p5,
  epoch: { datetime: string; website: string; topics: string[] }[],
  isAnimating: boolean,
  siteAdTechs: Record<string, string[]>,
  handleUserVisit: (visitIndex: number) => void
) {
  const app = {
    userIcon: null as p5.Image | null,
    completedIcon: null as p5.Image | null,
    circlePositions: [] as { x: number; y: number }[],
    siteAdTechs: {} as Record<string, string[]>,
    visitIndex: 0,
    playing: true,
    speedMultiplier: 1,

    drawTimelineLine: (position: { x: number; y: number }) => {
      const { diameter, horizontalSpacing } = config.timeline.circleProps;
      const circleHorizontalSpace = horizontalSpacing + diameter + 100;

      p.line(
        position.x,
        position.y,
        position.x + circleHorizontalSpace * 8,
        position.y
      );
    },

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

        app.circlePositions.push({ x: xPosition, y: position.y });
        app.drawCircle(index);

        p.text(circleItem.datetime, xPosition, 20);
        p.text(circleItem.website, xPosition, 40);
        p.text(circleItem.topics.join(', '), xPosition, 60);

        p.line(
          xPosition,
          position.y - diameter / 2,
          xPosition,
          position.y - 50
        );
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
    },

    reset: () => {
      app.visitIndex = 0;
      app.speedMultiplier = 1;
      p.clear();
      app.drawTimelineLine(config.timeline.position);
      app.drawTimeline(config.timeline.position, epoch);
    },

    updateSpeedMultiplier: (speedMultiplier: number) => {
      app.speedMultiplier = speedMultiplier;
    },

    userVisitDone: (index: number) => {
      app.drawCircle(index, true);
      app.resetInfoBox(index);

      const position = app.circlePositions[index];
      const previousPosition =
        app.circlePositions[index - 1] || config.timeline.position;
      const circleDiameter = config.timeline.circleProps.diameter;

      p.push();
      p.stroke('#1A73E8');
      p.line(
        previousPosition.x + (index !== 0 ? circleDiameter / 2 : 0),
        previousPosition.y,
        position.x - circleDiameter / 2,
        position.y
      );
      p.pop();
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

      const currentCircle = epoch[visitIndex];
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
        } while (isOverlapping);

        smallCirclePositions.push({ x: randomX, y: randomY });

        // @ts-ignore
        const adTechColor = getAdtechsColors(p)[adTechs[i]];

        p.push();
        p.fill(adTechColor);
        p.circle(randomX, randomY, smallCircleDiameter);
        p.pop();
      }
    },

    drawInfoBox: (index: number, currentSite: string) => {
      const position = app.circlePositions[index];
      const topics = epoch[index].topics;
      const { diameter } = config.timeline.circleProps;

      p.push();
      p.rectMode(p.CENTER);
      p.fill(245);
      p.stroke(255);
      p.rect(
        position.x,
        position.y + diameter / 2 + 150,
        280,
        160,
        10,
        10,
        10,
        10
      );

      p.fill(0);
      p.textSize(12);
      p.textAlign(p.LEFT, p.CENTER);
      p.textStyle(p.BOLD);
      p.text('Topics:', position.x - 120, position.y + diameter / 2 + 95);
      p.textStyle(p.NORMAL);
      p.text(
        topics.join(', '),
        position.x - 70,
        position.y + diameter / 2 + 95
      );

      const adTechs = siteAdTechs[currentSite];
      const numAdTechs = adTechs.length;

      p.textStyle(p.BOLD);
      p.text(
        'Observed-by context domains:',
        position.x - 120,
        position.y + diameter / 2 + 125
      );
      p.textStyle(p.NORMAL);
      for (let i = 0; i < numAdTechs; i++) {
        const adTech = adTechs[i];
        // @ts-ignore
        const adTechColor = getAdtechsColors(p)[adTech];

        p.fill(adTechColor);
        p.circle(
          position.x - 110,
          position.y + diameter / 2 + 150 + i * 25,
          20
        );
        p.fill(0);
        p.text(
          adTech,
          position.x - 85,
          position.y + diameter / 2 + 150 + 25 * i
        );
      }

      p.pop();
    },

    resetInfoBox: (index: number) => {
      const position = app.circlePositions[index];
      const { diameter } = config.timeline.circleProps;

      p.push();
      p.fill(255);
      p.stroke(255);
      p.rectMode(p.CENTER);
      p.rect(position.x, position.y + diameter / 2 + 150, 300, 200);
      p.pop();
    },
  };

  p.preload = () => {
    app.userIcon = p.loadImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAn9JREFUeF7tmktywjAMhp2TFU4CM7DILUpvkQXMwEmanixFnZgmxi85knAbsQQntj79kmWZxqz806zcfqMAVAErJ6AhsHIBaBLUENAQWDkBDYFXCmB/bDfXc9e/cg3iCtgf29MwmDdjzMYxvG8a83U9dydJIGIAwNvDYN49hj/Z2zTmQwqECIDR62B89kcKAjuAEuMtJQkI7AB2h3YIuH2a/Nx88Hjknhe2nImSFUDI+z7PRpTS3y7dNjt2kANZAfi8H5P1mCg/XRtul45tnWwv9hmTE9O7QwsAZiHBGQacAGC/n2X+HAABcGx5QBpA0pBS5SBD/zfJlj6Yeq7Uk75kmKOc1HpCv3MqACo/N6ElM3oAQFI51QGABRXsAk95A97zJ3cBWDhFHcApf1gjWwhYSfq2NfcUGDsgcXpfBECouMmJWW7viwCIhUIMgoTxYgCsoZknQ2iMQD9ApFPEngNcLwME+M7pCv10g+65oJcy/HHkzonF/zxGXAG1wVQAUh6B7dDu92P8z6Yec4D9TiwXsClg0gUGo4Itr4QDbHI0XF1iUgBERgeZcNQGJAAwPX+KkKMEsRhARq1PYbP3HRQgFgFAGP+o6mzBAxbZomeaICdFUm7uSPYYoiV3qXsyjCcpaSeVY+xmqRhCkQISNT2J4T7HpOYtuT8oAhDwPpvhvvOE23GGc4QkgNl1F0UywoYi1f0BWgHSbesQGKrmKQkAkJ9TymIdih7v+5NFyQ0SFQC0ARwPKICCq3RVAFaKS7q82Lmw40VCABY1lq7Y9bGPL+knokOA3QrhCRSAMPDqplMFVOcS4QWpAoSBVzedKqA6lwgvSBUgDLy66VavgG9uL15QKQoHkQAAAABJRU5ErkJggg=='
    );
    app.completedIcon = p.loadImage(
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyNyAyNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjQ5OTkgMjYuNDE2N0MxMS43MTMxIDI2LjQxNjcgMTAuMDMzOSAyNi4wNzc2IDguNDYyNDIgMjUuMzk5NUM2Ljg5MDg5IDI0LjcyMTQgNS41MjM4OCAyMy44MDExIDQuMzYxMzggMjIuNjM4NkMzLjE5ODg4IDIxLjQ3NjEgMi4yNzg1NiAyMC4xMDkxIDEuNjAwNDQgMTguNTM3NUMwLjkyMjMxNCAxNi45NjYgMC41ODMyNTIgMTUuMjg2OCAwLjU4MzI1MiAxMy41QzAuNTgzMjUyIDExLjcxMzIgMC45MjIzMTQgMTAuMDM0MSAxLjYwMDQ0IDguNDYyNTRDMi4yNzg1NiA2Ljg5MTAxIDMuMTk4ODggNS41MjQgNC4zNjEzOCA0LjM2MTVDNS41MjM4OCAzLjE5OSA2Ljg5MDg5IDIuMjc4NjkgOC40NjI0MiAxLjYwMDU2QzEwLjAzMzkgMC45MjI0MzcgMTEuNzEzMSAwLjU4MzM3NCAxMy40OTk5IDAuNTgzMzc0QzE0Ljg5OTIgMC41ODMzNzQgMTYuMjIzMiAwLjc4Nzg4OCAxNy40NzE4IDEuMTk2OTJDMTguNzIwNCAxLjYwNTk0IDE5Ljg3MjEgMi4xNzY0MyAyMC45MjcgMi45MDgzN0wxOS4wNTQxIDQuODEzNThDMTguMjM2IDQuMjk2OTIgMTcuMzY0MiAzLjg5MzI3IDE2LjQzODUgMy42MDI2NEMxNS41MTI4IDMuMzEyMDIgMTQuNTMzMyAzLjE2NjcxIDEzLjQ5OTkgMy4xNjY3MUMxMC42MzY3IDMuMTY2NzEgOC4xOTg3IDQuMTczMTMgNi4xODU4NiA2LjE4NTk4QzQuMTczMDEgOC4xOTg4MyAzLjE2NjU5IDEwLjYzNjggMy4xNjY1OSAxMy41QzMuMTY2NTkgMTYuMzYzMiA0LjE3MzAxIDE4LjgwMTMgNi4xODU4NiAyMC44MTQxQzguMTk4NyAyMi44MjcgMTAuNjM2NyAyMy44MzM0IDEzLjQ5OTkgMjMuODMzNEMxNi4zNjMxIDIzLjgzMzQgMTguODAxMSAyMi44MjcgMjAuODE0IDIwLjgxNDFDMjIuODI2OCAxOC44MDEzIDIzLjgzMzMgMTYuMzYzMiAyMy44MzMzIDEzLjVDMjMuODMzMyAxMy4xMTI1IDIzLjgxMTcgMTIuNzI1IDIzLjc2ODcgMTIuMzM3NUMyMy43MjU2IDExLjk1IDIzLjY2MSAxMS41NzMzIDIzLjU3NDkgMTEuMjA3M0wyNS42NzM5IDkuMTA4MzdDMjUuOTEwNyA5Ljc5NzI2IDI2LjA5MzcgMTAuNTA3NyAyNi4yMjI4IDExLjIzOTZDMjYuMzUyIDExLjk3MTYgMjYuNDE2NiAxMi43MjUgMjYuNDE2NiAxMy41QzI2LjQxNjYgMTUuMjg2OCAyNi4wNzc1IDE2Ljk2NiAyNS4zOTk0IDE4LjUzNzVDMjQuNzIxMyAyMC4xMDkxIDIzLjgwMSAyMS40NzYxIDIyLjYzODUgMjIuNjM4NkMyMS40NzYgMjMuODAxMSAyMC4xMDg5IDI0LjcyMTQgMTguNTM3NCAyNS4zOTk1QzE2Ljk2NTkgMjYuMDc3NiAxNS4yODY3IDI2LjQxNjcgMTMuNDk5OSAyNi40MTY3Wk0xMS42OTE2IDE5LjQ0MTdMNi4yMDIgMTMuOTUyMUw4LjAxMDMzIDEyLjE0MzhMMTEuNjkxNiAxNS44MjVMMjQuNjA4MyAyLjg3NjA4TDI2LjQxNjYgNC42ODQ0MkwxMS42OTE2IDE5LjQ0MTdaIiBmaWxsPSIjMUE3M0U4Ii8+Cjwvc3ZnPgo='
    );
  };

  p.setup = () => {
    const circleHorizontalSpace =
      config.timeline.circleProps.horizontalSpacing +
      config.timeline.circleProps.diameter;
    p.createCanvas(circleHorizontalSpace * 6, config.canvas.height);

    p.textFont('sans-serif');
    app.drawTimelineLine(config.timeline.position);
    app.drawTimeline(config.timeline.position, epoch);

    if (!isAnimating) {
      while (app.visitIndex < epoch.length) {
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
  };
}

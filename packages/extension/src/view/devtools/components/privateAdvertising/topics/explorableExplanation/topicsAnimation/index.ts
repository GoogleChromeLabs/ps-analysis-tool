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
import { assignAdtechsToSites, getAdtechsColors } from './utils';
import { adtechs, websites } from './data';

/**
 * Setup function for p5.js
 * @param p - p5.js instance
 * @param epoch - Array of objects containing datetime, website, and topics
 * @returns Object with callbacks to control the animation
 */
export function topicsAnimation(
  p: p5,
  epoch: { datetime: string; website: string; topics: string[] }[]
) {
  const app = {
    userIcon: null as p5.Image | null,
    circlePositions: [] as { x: number; y: number }[],
    siteAdTechs: {} as Record<string, string[]>,
    visitIndex: 0,
    playing: true,

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
      });
    },

    drawCircle: (index: number) => {
      const position = app.circlePositions[index];
      const { diameter } = config.timeline.circleProps;

      p.circle(position.x, position.y, diameter);
    },

    play: () => {
      if (app.visitIndex >= epoch.length) {
        return;
      }

      app.handleUserVisit(app.visitIndex);
      app.visitIndex++;
    },

    togglePlay: (state: boolean) => {
      app.playing = state;
    },

    reset: () => {
      app.visitIndex = 0;
      p.clear();
      app.drawTimelineLine(config.timeline.position);
      app.drawTimeline(config.timeline.position, epoch);
    },

    handleUserVisit: (visitIndex: number) => {
      const circlePosition = app.circlePositions[visitIndex];

      if (circlePosition === undefined) {
        return;
      }

      const user = config.timeline.user;

      if (visitIndex > 0) {
        app.drawCircle(visitIndex - 1);
        app.resetInfoBox(visitIndex - 1);
      }

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
    },

    drawSmallCircles: (index: number, currentSite: string) => {
      const position = app.circlePositions[index];
      const { diameter } = config.timeline.circleProps;
      const smallCircleDiameter = diameter / 5;

      const distanceFromEdge = 6;

      const adTechs = app.siteAdTechs[currentSite];
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
        180,
        10,
        10,
        10,
        10
      );

      p.fill(0);
      p.textSize(16);
      p.textAlign(p.LEFT, p.CENTER);
      p.textStyle(p.BOLD);
      p.text('Topics:', position.x - 120, position.y + diameter / 2 + 85);
      p.textStyle(p.NORMAL);
      p.text(
        topics.join(', '),
        position.x - 55,
        position.y + diameter / 2 + 85
      );

      const adTechs = app.siteAdTechs[currentSite];
      const numAdTechs = adTechs.length;

      p.textStyle(p.BOLD);
      p.text(
        'Observed-by context domains:',
        position.x - 120,
        position.y + diameter / 2 + 130
      );
      p.textStyle(p.NORMAL);
      for (let i = 0; i < numAdTechs; i++) {
        const adTech = adTechs[i];
        // @ts-ignore
        const adTechColor = getAdtechsColors(p)[adTech];

        p.fill(adTechColor);
        p.circle(
          position.x - 110,
          position.y + diameter / 2 + 160 + i * 25,
          20
        );
        p.fill(0);
        p.text(
          adTech,
          position.x - 85,
          position.y + diameter / 2 + 160 + 25 * i
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
  };

  p.setup = () => {
    const circleHorizontalSpace =
      config.timeline.circleProps.horizontalSpacing +
      config.timeline.circleProps.diameter;
    p.createCanvas(circleHorizontalSpace * 6, config.canvas.height);

    app.siteAdTechs = assignAdtechsToSites(websites, adtechs);

    p.textFont('sans-serif');
    app.drawTimelineLine(config.timeline.position);
    app.drawTimeline(config.timeline.position, epoch);
  };

  p.draw = () => {
    const delay = config.timeline.stepDelay / 10;

    if (p.frameCount % delay === 0 && app.playing) {
      app.play();
    }
  };

  return {
    togglePlay: app.togglePlay,
    reset: app.reset,
  };
}

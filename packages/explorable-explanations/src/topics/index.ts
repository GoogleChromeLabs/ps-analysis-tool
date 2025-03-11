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
import { websitesToIconsMapping } from './data';
import icons from '../icons.json';
import TopicsAnimation from './animation';

/**
 * Topics animation
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
  const app = new TopicsAnimation(
    p,
    epoch,
    isInteractive,
    siteAdTechs,
    handleUserVisit,
    setHighlightAdTech
  );

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
    app.canvas.mouseMoved(() => app.mouseMoved());
    app.canvas.mouseClicked(() => app.mouseClicked());

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
    togglePlay: (state: boolean) => app.togglePlay(state),
    reset: () => app.reset(),
    updateSpeedMultiplier: (speedMultiplier: number) =>
      app.updateSpeedMultiplier(speedMultiplier),
    getCurrentVisitIndex: () => app.getCurrentVisitIndex(),
  };
}

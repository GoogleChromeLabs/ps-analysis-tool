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
 * Internal dependencies.
 */
import ProgressLine from './progressLine';
import app from '../app';
import config from '../config';
import Box from './box';
import { wipeAndRecreateInterestCanvas } from '../utils';

const LEFT_MARGIN = 70; // Margin from the left side of the canvas
const ANIMATION_SPEED = 15; // Controls the speed of the horizontal line drawing
const EXPAND_ICON_SIZE = 20;

let spacing, progress, renderedBranchIds, endpoints;

const Branches = async ({ x1, y1, branches, currentIndex }) => {
  x1 = typeof x1 === 'function' ? x1() : x1;
  y1 = typeof y1 === 'function' ? y1() : y1;

  branches = branches.map((branch, index) => ({
    ...branch,
    id: index, // To prevent duplicate rendering
  }));

  progress = 0;
  renderedBranchIds = [];
  endpoints = [];
  const p = app.p;

  const y2 = y1 + 50;
  spacing = 300; // Calculate spacing based on canvas width

  await ProgressLine({
    x1: x1,
    y1: y1,
    direction: 'down',
    noArrow: true,
    noAnimation: true,
  });

  return new Promise((resolve) => {
    const animate = () => {
      if (app.isRevisitingNodeInInteractiveMode) {
        const branchXEndpoint =
          currentIndex * LEFT_MARGIN + 15 + (branches.length - 1) * spacing;

        branches.forEach(({ id, type }, index) => {
          const x = currentIndex * LEFT_MARGIN + 15 + index * spacing;
          const y = y2 - 9;
          let endpoint;
          p.push();
          p.stroke(0);
          p.line(x, y, branchXEndpoint, y);
          p.pop();
          p.push();
          p.stroke(0);
          p.line(x, y, x, y + 20);
          p.pop();
          if (type === 'datetime') {
            endpoint = drawDateTimeBranch(x, y, branches[index]);
          }

          if (type === 'box') {
            endpoint = drawBoxesBranch(x, y, branches[index]);
          }

          endpoints.push(endpoint);

          renderedBranchIds.push(id);
        });
        resolve(endpoints);
        return;
      }
      if (app.cancelPromise) {
        resolve(endpoints);
        return;
      }

      if (app.timeline.isPaused) {
        requestAnimationFrame(animate); // Continue loop but remain paused
        return;
      }

      // Clear canvas or update logic (if necessary)
      wipeAndRecreateInterestCanvas();

      // Draw the animated timeline
      drawAnimatedTimeline(currentIndex * LEFT_MARGIN, y2 - 9, branches).then(
        () => {
          resolve(endpoints);
        }
      );

      // Continue animation until progress completes
      if (progress < (branches.length - 1) * spacing) {
        progress += ANIMATION_SPEED;
        requestAnimationFrame(animate);
      }
    };

    // Start the animation loop
    requestAnimationFrame(animate);
  });
};

const drawAnimatedTimeline = (x, y, branches) => {
  const p = app.p;
  const leftMargin = 15;
  x = x + leftMargin;
  p.push();
  p.stroke(0);
  p.strokeWeight(1);
  p.pop();

  if (app.cancelPromise) {
    return new Promise((resolve) => resolve());
  }

  return new Promise((resolve) => {
    // Draw the horizontal line
    p.line(x, y, x + progress, y);

    if (app.cancelPromise) {
      resolve();
      return;
    }

    // Draw vertical lines and labels as the horizontal line progresses
    for (let i = 0; i < branches.length; i++) {
      const branchX = x + i * spacing;
      const branch = branches[i];
      let endpoint;
      if (app.cancelPromise) {
        resolve();
        return;
      }

      if (app.cancelPromise) {
        resolve();
        return;
      }

      if (progress >= i * spacing && !renderedBranchIds.includes(branch.id)) {
        // Draw vertical line once the horizontal line reaches its position
        p.push();
        p.stroke(0);
        p.line(branchX, y, branchX, y + 20);
        p.pop();

        switch (branch.type) {
          case 'datetime':
            endpoint = drawDateTimeBranch(branchX, y, branch);
            break;
          case 'box':
            endpoint = drawBoxesBranch(branchX, y, branch);
            break;
          default:
            break;
        }

        // Store the endpoint coordinates for each branch
        endpoints.push(endpoint);

        renderedBranchIds.push(branch.id);
      }
    }
    if (app.cancelPromise) {
      resolve();
      return;
    }
    // Resolve if the progress exceeds the required length
    if (progress >= (branches.length - 1) * spacing) {
      resolve();
      return;
    }
  });
};

const drawDateTimeBranch = (x, y, branch) => {
  const p = app.p;

  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(config.canvas.fontSize);
  p.text(`${branch.date}`, x, y + 35);
  p.text(`${branch.time}`, x, y + 50);

  p.image(
    p.expandIcon,
    x - EXPAND_ICON_SIZE / 2,
    y + 65,
    EXPAND_ICON_SIZE,
    EXPAND_ICON_SIZE
  );
  p.pop();

  return { x: x, y: y + 50 };
};

const drawBoxesBranch = (x, y, branch) => {
  const p = app.p;
  const { flow } = config;

  Box({
    title: branch.title,
    description: branch.description,
    x: x - flow.box.width / 2,
    y: y + 20,
    color: branch?.color || flow.colors.box.background,
  });

  p.image(
    p.expandIcon,
    x - EXPAND_ICON_SIZE / 2,
    y + 80,
    EXPAND_ICON_SIZE,
    EXPAND_ICON_SIZE
  );

  return { x: x, y: y + EXPAND_ICON_SIZE * 3 + 5 };
};

export default Branches;

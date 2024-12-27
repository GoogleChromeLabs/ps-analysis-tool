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
import { delay, wipeAndRecreateInterestCanvas } from '../utils';
import FlowExpander from '../modules/flowExpander';

const LEFT_MARGIN = 70; // Margin from the left side of the canvas
const EXPAND_ICON_SIZE = config.timeline.expandIconSize;

let spacing, renderedBranchIds, endpoints;

const Branches = async ({
  x1,
  y1,
  branches,
  currentIndex,
  noAnimation = app.speedMultiplier === 4,
}) => {
  x1 = typeof x1 === 'function' ? x1() : x1;
  y1 = typeof y1 === 'function' ? y1() : y1;

  branches = branches.map((branch, index) => ({
    ...branch,
    id: index, // To prevent duplicate rendering
  }));

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
    noAnimation: app.speedMultiplier === 4,
  });

  const drawInstantly = () => {
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
  };

  if (app.isRevisitingNodeInInteractiveMode || noAnimation) {
    drawInstantly();
    await delay(noAnimation ? 1000 : 0);
    return endpoints;
  }

  if (app.cancelPromise) {
    return endpoints;
  }

  // Clear canvas or update logic (if necessary)
  wipeAndRecreateInterestCanvas();

  const branchXEndpoint =
    currentIndex * LEFT_MARGIN + 15 + (branches.length - 1) * spacing;
  const branchXStartpoint = currentIndex * LEFT_MARGIN + 15;

  await ProgressLine({
    x1: branchXStartpoint,
    y1: y2 - 9,
    customWidth: branchXEndpoint - branchXStartpoint,
    direction: 'right',
    noArrow: true,
    noAnimation: app.speedMultiplier === 4,
    isBranch: true,
  });

  await Promise.all(
    branches.map(async ({ id, type }, index) => {
      const x = currentIndex * LEFT_MARGIN + 15 + index * spacing;
      const y = y2 - 9;
      let endpoint;

      await ProgressLine({
        x1: x,
        y1: y,
        customHeight: 20,
        direction: 'down',
        noArrow: true,
        noAnimation: app.speedMultiplier === 4,
      });

      if (type === 'datetime') {
        endpoint = drawDateTimeBranch(x, y, branches[index]);
      }

      if (type === 'box') {
        endpoint = drawBoxesBranch(x, y, branches[index]);
      }

      endpoints.push(endpoint);
      renderedBranchIds.push(id);
    })
  );

  const nextTip = await FlowExpander({
    branchType: branches[0].type,
    nextTipCoordinates: endpoints,
  });

  return nextTip;
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

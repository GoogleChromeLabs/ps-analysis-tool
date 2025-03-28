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
import config, { publisherData } from '../config';
import Box from './box';
import {
  delay,
  scrollToCoordinates,
  wipeAndRecreateInterestCanvas,
} from '../utils';
import FlowExpander from './flowExpander';
import type { Coordinates, CoordinateValue } from '../types';
import { getCoordinateValues } from '../utils/getCoordinateValues';
import Info from './info';

const EXPAND_ICON_SIZE = config.timeline.expandIconSize;

let spacing: number, renderedBranchIds: number[], endpoints: Coordinates[];

type Branch = {
  id: number;
  type: string;
  date: string | (() => string);
  time: string | (() => string);
  title: string;
  description: string;
  info?: {
    title: string;
    info: string;
  };
};

type BranchesProps = {
  x1: CoordinateValue;
  y1: CoordinateValue;
  branches: Branch[];
  currentIndex: number;
  noAnimation: boolean;
};

const Branches = async ({
  x1: x1Value,
  y1: y1Value,
  branches,
  currentIndex,
  noAnimation = app.speedMultiplier === 4,
}: BranchesProps): Promise<void | Coordinates> => {
  const { x: x1, y: y1 } = getCoordinateValues({ x: x1Value, y: y1Value });

  const currentSite = config.timeline.circles[currentIndex].website;
  const typeOfBranches = branches[0].type;

  branches = branches.map((branch, index) => ({
    ...branch,
    id: index, // To prevent duplicate rendering
    date: typeof branch.date === 'function' ? branch.date() : branch.date,
    time: typeof branch.time === 'function' ? branch.time() : branch.time,
    info: branch?.info,
  }));

  renderedBranchIds = [];
  endpoints = [];
  const p = app.p;
  if (!p) {
    return;
  }

  const y2 = y1 + 50;
  spacing = 300; // Calculate spacing based on canvas width
  const branchXEndpoint = x1 > spacing ? x1 + spacing : x1 + spacing * 2;
  const branchXStartpoint = x1 > spacing ? x1 - spacing : x1;

  await ProgressLine({
    x1: x1,
    y1: y1,
    direction: 'down',
    noArrow: true,
    noAnimation: app.speedMultiplier === 4,
    isForBranches: true,
  });

  const drawInstantly = () => {
    branches.forEach(({ id, type, info }, index) => {
      const x = branchXStartpoint + index * spacing;
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
        endpoint = drawDateTimeBranch(x, y, branches[index], info);
      }

      if (type === 'box') {
        endpoint = drawBoxesBranch(x, y, branches[index]);
      }

      endpoints.push(endpoint);

      renderedBranchIds.push(id);
    });
  };

  if (app.isRevisitingNodeInInteractiveMode) {
    drawInstantly();

    if (app.isAutoExpand) {
      if (typeOfBranches === 'datetime') {
        app.setSelectedDateTime(
          `${publisherData[currentSite].branches[1].date} ${publisherData[currentSite].branches[1].time}`
        );
      } else {
        app.setSelectedAdUnit(publisherData[currentSite].adunits[1]);
      }
      const { x, y } = getCoordinateValues(endpoints[1]);
      scrollToCoordinates({ x, y });
      // eslint-disable-next-line consistent-return
      return endpoints[1];
    } else {
      const { x, y } = getCoordinateValues(endpoints[0]);
      scrollToCoordinates({ x, y });
      const nextTip = await FlowExpander({
        nextTipCoordinates: endpoints,
        typeOfBranches,
      });
      // eslint-disable-next-line consistent-return
      return nextTip;
    }
  }

  if (noAnimation) {
    drawInstantly();

    if (app.isAutoExpand) {
      if (typeOfBranches === 'datetime') {
        app.setSelectedDateTime(
          `${publisherData[currentSite].branches[1].date} ${publisherData[currentSite].branches[1].time}`
        );
      } else {
        app.setSelectedAdUnit(publisherData[currentSite].adunits[1]);
      }

      const { x, y } = getCoordinateValues(endpoints[1]);
      scrollToCoordinates({ x, y });
      await delay(1000);
      // eslint-disable-next-line consistent-return
      return endpoints[1];
    } else {
      const { x, y } = getCoordinateValues(endpoints[0]);
      scrollToCoordinates({ x, y });

      const nextTip = await FlowExpander({
        nextTipCoordinates: endpoints,
        typeOfBranches,
      });

      await delay(1000);
      // eslint-disable-next-line consistent-return
      return nextTip;
    }
  }

  // Clear canvas or update logic (if necessary)
  wipeAndRecreateInterestCanvas();

  await ProgressLine({
    x1: branchXStartpoint,
    y1: y2 - 9,
    customWidth: branchXEndpoint - branchXStartpoint,
    direction: 'right',
    noArrow: true,
    noAnimation: app.speedMultiplier === 4,
    isForBranches: true,
  });

  if (app.cancelPromise) {
    if (typeOfBranches === 'datetime') {
      app.setSelectedDateTime(
        `${publisherData[currentSite].branches[1].date} ${publisherData[currentSite].branches[1].time}`
      );
    } else {
      app.setSelectedAdUnit(publisherData[currentSite].adunits[1]);
    }
    const { x, y } = getCoordinateValues(endpoints[1]);
    scrollToCoordinates({ x, y });
    // eslint-disable-next-line consistent-return
    return endpoints[1];
  }

  await Promise.all(
    branches.map(async ({ id, type, info }, index) => {
      const x = branchXStartpoint + index * spacing;
      const y = y2 - 9;
      let endpoint;

      await ProgressLine({
        x1: x,
        y1: y,
        customHeight: 20,
        direction: 'down',
        noArrow: true,
        noAnimation: app.speedMultiplier === 4,
        isForBranches: true,
      });

      if (type === 'datetime') {
        endpoint = drawDateTimeBranch(x, y, branches[index], info);
      }

      if (type === 'box') {
        endpoint = drawBoxesBranch(x, y, branches[index]);
      }

      endpoints.push(endpoint);
      renderedBranchIds.push(id);
    })
  );

  if (app.isAutoExpand) {
    if (typeOfBranches === 'datetime') {
      app.setSelectedDateTime(
        `${publisherData[currentSite].branches[1].date} ${publisherData[currentSite].branches[1].time}`
      );
    } else {
      app.setSelectedAdUnit(publisherData[currentSite].adunits[1]);
    }
    const { x, y } = getCoordinateValues(endpoints[1]);
    scrollToCoordinates({ x, y });
    // eslint-disable-next-line consistent-return
    return endpoints[1];
  }

  const { x, y } = getCoordinateValues(endpoints[0]);
  scrollToCoordinates({ x, y });

  const nextTip = await FlowExpander({
    nextTipCoordinates: endpoints,
    typeOfBranches,
  });
  // eslint-disable-next-line consistent-return
  return nextTip;
};

const drawDateTimeBranch = (x, y, branch, info) => {
  const p = app.p;

  if (!p) {
    return { x, y };
  }

  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(config.canvas.fontSize);
  p.text(`${branch.date}`, x, y + 35);
  p.text(`${branch.time}`, x, y + 50);

  if (info) {
    Info({
      x: x + 31,
      y: y + 42,
      title: info.title,
      info: info.info,
    });
  }

  if (app.isAutoExpand) {
    p.pop();
    return { x: x, y: y + 30 };
  }

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

  if (!p) {
    return { x, y };
  }

  const { flow } = config;

  Box({
    title: branch.title,
    description: branch.description,
    x: x - flow.box.width / 2,
    y: y + 20,
    color: branch?.color || flow.colors.box.background,
    isBranchComponent: true,
  });

  if (app.isAutoExpand) {
    return { x: x, y: y + 30 };
  }

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

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

const leftMargin = 50; // Margin from the left side of the canvas
let spacing; // Spacing between each branch
let progress = 0; // Tracks the progress of the horizontal line animation
const animationSpeed = 5; // Controls the speed of the horizontal line drawing
let interval = null;

const Branches = async ({ x1, y1 }) => {
  const branches = [
    {
      date: '2024-10-02',
      time: '10:00:22PM',
    },
    {
      date: '2024-10-03',
      time: '11:00:22PM',
    },
    {
      date: '2024-10-03',
      time: '11:00:22PM',
    },
  ];

  const y2 = y1 + 50;
  spacing = (app.p.width - 2 * leftMargin) / (branches.length - 1); // Calculate spacing based on canvas width

  await ProgressLine({
    x1: x1,
    y1: y1,
    x2: x1,
    y2,
    direction: 'down',
    noArrow: true,
  });

  interval = setInterval(async () => {
    await drawAnimatedTimeline(leftMargin, y2 - 9, branches);
  }, 20);
};

const drawAnimatedTimeline = (x, y, branches) => {
  const p = app.p;
  p.stroke(0);
  p.strokeWeight(1);

  return new Promise((resolve) => {
    // Draw the animated horizontal line
    if (progress < (branches.length - 1) * spacing) {
      progress += animationSpeed; // Increase the length of the horizontal line
    } else {
      resolve(true);
      clearInterval(interval);
    }
    p.line(x, y, x + progress, y);

    // Draw each vertical line and label when the horizontal line reaches its position
    for (let i = 0; i < branches.length; i++) {
      const branchX = x + i * spacing;

      if (progress >= i * spacing) {
        // Start drawing each vertical line once the horizontal line reaches it
        // Draw vertical line fully
        p.stroke(0);
        p.line(branchX, y, branchX, y + 20);

        // Display date and time below the line
        p.noStroke();
        p.fill(0);
        p.text(`${branches[i].date}`, branchX, y + 35);
        p.text(`${branches[i].time}`, branchX, y + 50);
      }
    }
  });
};

export default Branches;

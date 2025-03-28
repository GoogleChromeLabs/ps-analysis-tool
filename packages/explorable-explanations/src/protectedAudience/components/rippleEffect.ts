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
import app from '../app';
import config from '../config';
import { getCoordinateValues } from '../utils/getCoordinateValues';
import type { Coordinates } from '../types';

type RippleEffect = {
  setUp: () => void;
  start: (x: number, y: number) => Promise<void>;
  create: (x: number, y: number, speed: number) => void;
};

const clearArea = (x: number, y: number) => {
  if (!app.p) {
    return;
  }

  const { numRipples, maxRadius } = config.rippleEffect;
  const clearWidth = maxRadius * 2 + (numRipples - 1) * 40;
  const clearHeight = maxRadius * 1.5;

  app.p.push();
  app.p.fill(config.canvas.background);
  app.p.noStroke();
  app.p.rect(x - 1, y - clearHeight / 2 - 200, clearWidth, clearHeight + 400);
  app.p.pop();
};

// @todo To be moved to components.
const rippleEffect: RippleEffect = {
  setUp: () => {
    config.rippleEffect.rippled = false;
    config.rippleEffect.ripples = [];

    for (let i = 0; i < config.rippleEffect.numRipples; i++) {
      config.rippleEffect.ripples.push({
        radius: 0,
        baseSpeed: 1 + i * 0.5,
      });
    }
  },

  start: (x = 0, y = 0) => {
    return new Promise((resolve) => {
      if (config.rippleEffect.rippled) {
        resolve();
        return;
      }

      let baseSpeed = 1;

      if (app.speedMultiplier > 2) {
        baseSpeed = app.speedMultiplier / 2;
      }

      let startTime: number | null = null; // Tracks the start time of the animation
      const duration = config.rippleEffect.time / baseSpeed; // Total animation time
      config.rippleEffect.rippled = true;

      const animate = (timestamp: number) => {
        if (app.cancelPromise) {
          resolve();
          return;
        }

        if (app.timeline.isPaused) {
          requestAnimationFrame(animate); // Keep the loop alive but paused
          return;
        }

        if (!startTime) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;

        if (elapsed > duration) {
          clearArea(x, y);
          resolve();
          return;
        }

        rippleEffect.create?.(x, y, baseSpeed);

        // Continue the animation loop
        requestAnimationFrame(animate);
      };

      // Start the animation loop
      requestAnimationFrame(animate);
    });
  },

  create: (rippleX, rippleY, speed) => {
    // Calculate the area to clear
    const { ripples, maxRadius } = config.rippleEffect;
    const p = app.p;

    if (!p) {
      return;
    }

    p.push();
    // Clear only the area used by the ripples
    clearArea(rippleX, rippleY);
    let allComplete = true;
    p.translate(rippleX, rippleY);

    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i];
      if (ripple.radius < maxRadius) {
        ripple.radius += ripple.baseSpeed * speed;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        allComplete = false;
      } else {
        ripple.radius = maxRadius; // Ensure the radius doesn't exceed maxRadius
      }

      // Black color with fading opacity
      const opacity = p.map(ripple.radius, 0, maxRadius, 255, 0);
      p.stroke(0, opacity);
      p.noFill();

      // Increased spacing between ripples
      const spacing = 40;
      p.arc(
        0,
        0,
        (ripple.radius + i * spacing) * 2,
        (ripple.radius + i * spacing) * 2,
        -p.HALF_PI,
        p.HALF_PI
      );
    }

    p.pop(); // Restore the original transformation state
  },
};

const RippleEffect = async (coordinates: Coordinates) => {
  const { x, y } = getCoordinateValues(coordinates);
  if (!rippleEffect.setUp || !rippleEffect.start) {
    return;
  }

  rippleEffect.setUp();
  await rippleEffect.start(x, y);
};

export default RippleEffect;

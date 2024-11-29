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

const RippleEffect = async ({ x, y }) => {
  rippleEffect.setUp();
  await rippleEffect.start(x, y);
};

// @todo To be moved to components.
const rippleEffect = {};

rippleEffect.setUp = () => {
  config.rippleEffect.rippled = false;
  config.rippleEffect.ripples = [];

  for (let i = 0; i < config.rippleEffect.numRipples; i++) {
    config.rippleEffect.ripples.push({
      radius: 0,
      baseSpeed: 1 + i * 0.5,
    });
  }
};

rippleEffect.start = (x = 0, y = 0) => {
  return new Promise((resolve) => {
    if (config.rippleEffect.rippled) {
      resolve();
      return;
    }

    let startTime = null; // Tracks the start time of the animation
    const duration = config.rippleEffect.time; // Total animation time
    config.rippleEffect.rippled = true;

    const animate = (timestamp) => {
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
      } // Set the initial timestamp
      const elapsed = timestamp - startTime;

      if (elapsed > duration) {
        resolve();
        return;
      }

      rippleEffect.create(x, y);

      // Continue the animation loop
      requestAnimationFrame(animate);
    };

    // Start the animation loop
    requestAnimationFrame(animate);
  });
};

rippleEffect.create = (rippleX, rippleY) => {
  // Calculate the area to clear
  const { ripples, numRipples, speed, maxRadius } = config.rippleEffect;
  const clearWidth = maxRadius * 2 + (numRipples - 1) * 40;
  const clearHeight = maxRadius * 1.5;
  const p = app.p;

  p.push();
  // Clear only the area used by the ripples
  p.fill(config.canvas.background);
  p.noStroke();
  p.rect(
    rippleX - 1,
    rippleY - clearHeight / 2 - 200,
    clearWidth,
    clearHeight + 400
  );
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
};

export default RippleEffect;

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

const rippleEffect = {
  config: config.ripple,
};

rippleEffect.setUp = () => {
  rippleEffect.rippled = false;

  for (let i = 0; i < rippleEffect.config.numRipples; i++) {
    rippleEffect.config.ripples.push({
      radius: 0,
      baseSpeed: 1 + i * 0.5,
    });
  }
};

rippleEffect.start = (x = 0, y = 0) => {
  return new Promise((resolve) => {
    if (rippleEffect.rippled) {
      resolve();
      return false;
    }

    let totalTime = 0;
    const runInternval = 20;

    rippleEffect.rippled = true;

    const interval = setInterval(() => {
      if (totalTime > rippleEffect.config.time) {
        clearInterval(interval);
        resolve();
      }

      rippleEffect.create(x, y);
      totalTime = runInternval + totalTime;
    }, runInternval);
  });
};

rippleEffect.create = (rippleX, rippleY) => {
  // Calculate the area to clear
  const { ripples, numRipples, speed, maxRadius } = rippleEffect.config;
  const clearWidth = maxRadius * 2 + (numRipples - 1) * 40;
  const clearHeight = maxRadius * 2;
  const p = app.p;

  p.push();
  // Clear only the area used by the ripples
  p.fill(config.canvas.background);
  p.noStroke();
  p.rect(
    rippleX - clearWidth,
    rippleY + clearHeight / 2 - 201,
    clearWidth * 2,
    clearHeight + 400
  );

  p.translate(rippleX, rippleY);

  for (let i = 0; i < ripples.length; i++) {
    const ripple = ripples[i];
    if (ripple.radius < maxRadius) {
      ripple.radius += ripple.baseSpeed * speed;
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
      p.TWO_PI,
      p.PI
    );
  }

  p.pop(); // Restore the original transformation state
};

export default rippleEffect;

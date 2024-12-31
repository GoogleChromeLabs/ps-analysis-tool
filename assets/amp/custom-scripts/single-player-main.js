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
let stateObject = {
  player: null,
  lightboxEl: null,
  maxScroll: null,
  scaleVal: 1,
  scalingDown: false,
  deltaY: 0,
};

function setPlayer(playerEl) {
  stateObject.player = playerEl;
}

function setLightbox(lightbox) {
  stateObject.lightboxEl = lightbox;
}

/**
 * Closes the lightbox and resets the player and UI.
 */
function closePlayer() {
  const data = { storyOpened: false };
  const event = new CustomEvent('webStoriesLightBoxEvent', { detail: data });
  window.parent.document.dispatchEvent(event);

  stateObject.player.pause();

  document.body.classList.remove('lightbox-open');
  stateObject.lightboxEl.classList.add('closed');
}

/**
 * Handles scaling animation during interactions.
 */
function animateScale(val) {
  if (val < 1 && scalingDown) {
    stateObject.scaleVal = lerp(easeOutQuad(val), 1, 0.95);
    stateObject.lightboxEl.style.transform = `translate3d(0px, ${Math.pow(
      -deltaY,
      0.6
    )}px, 0) scale3d(${scaleVal}, ${scaleVal}, 1)`;
    requestAnimationFrame(() => animateScale(val + 0.05));
  }
}

/**
 * Resets scaling animation styles.
 */
function resetStyles() {
  stateObject.scalingDown = false;
  stateObject.scaleVal = 1;
  stateObject.lightboxEl.style.transform = `translate3d(0, 0, 0) scale3d(1, 1, 1)`;
}

/**
 * Initializes the carousel with the player and cards.
 */
function initializeCarousel() {
  const lightbox = document.body.querySelector('.lightbox');
  setLightbox(lightbox);

  stateObject.player.addEventListener('amp-story-player-close', closePlayer);
}

/**
 * Initializes the player and sets up the carousel.
 */
function init() {
  const playerEl = document.body.querySelector('amp-story-player');
  setPlayer(playerEl);

  if (stateObject.player.isReady) {
    initializeCarousel();
  } else {
    stateObject.player.addEventListener('ready', initializeCarousel);
  }
}

/**
 * Linear interpolation helper.
 */
function lerp(pct, v0, v1) {
  return v0 * (1 - pct) + v1 * pct;
}

/**
 * Ease-out quadratic easing function.
 */
function easeOutQuad(t) {
  return --t * t * t + 1;
}

const messageListener = ({ data: { storyUrl } }) => {
  try {
    stateObject.player.show(storyUrl, null, {
      animate: false,
    });
    const data = { storyOpened: true };
    const event = new CustomEvent('webStoriesLightBoxEvent', {
      detail: data,
    });
    window.parent.document.dispatchEvent(event);

    document.body.classList.add('lightbox-open');
    stateObject.lightboxEl.classList.remove('closed');
    resetStyles();
    stateObject.player.play();
  } catch (error) {
    //Fail silently
    console.log(error);
  }
};

// Initialize on window load.
window.addEventListener('load', init);
window.addEventListener('message', messageListener);

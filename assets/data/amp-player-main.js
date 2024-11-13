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
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsdoc/require-jsdoc */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-import-assign */

export let cards;
export let cardMargin;
export let cardWidth;

export let player;
export let lightboxEl;

export function setPlayer(playerEl) {
  player = playerEl;
}

export function setLightbox(lightbox) {
  lightboxEl = lightbox;
}

export function setCards(cardEls) {
  cards = cardEls;
}

export function setCardWidth(width) {
  cardWidth = width;
}

export function setCardMargin(margin) {
  cardMargin = margin;
}

let maxScroll;

/**
 * Initializes arrows for horizontal scrolling on desktop.
 */
export function initializeArrows() {
  const scrollContainer = document.querySelector('.carousel-cards-container');
  const containerPadding =
    parseFloat(
      getComputedStyle(scrollContainer.firstElementChild).paddingLeft
    ) +
    parseFloat(
      getComputedStyle(scrollContainer.firstElementChild).paddingRight
    );

  maxScroll =
    scrollContainer.offsetWidth -
    containerPadding +
    cardMargin -
    cards.length * cardWidth;

  if (maxScroll >= 0) {
    return;
  }

  const carousel = document.querySelector('.carousel-container');
  carousel.classList.toggle('overflow-right', true);
}

let scaleVal = 1;
let scalingDown = false;
const toggleThresholdPx = 60;
let deltaY = 0;
let isSwipeY = null;
let touchStartX = 0;
let touchStartY = 0;

/**
 * Initializes listeners.
 */
export function initializeTouchListeners() {
  player.addEventListener('amp-story-player-touchstart', (event) => {
    onTouchStart(event);
  });

  player.addEventListener('amp-story-player-touchmove', (event) => {
    onTouchMove(event);
  });

  player.addEventListener('amp-story-player-touchend', (event) => {
    onTouchEnd(event);
  });
}

function closePlayer() {
  player.pause();
  document.body.classList.toggle('lightbox-open', false);
  lightboxEl.classList.add('closed');
  cards.forEach((card) => {
    card.classList.remove('hidden');
  });
}

function onTouchStart(event) {
  lightboxEl.classList.add('dragging');
  touchStartX = event.detail.touches[0].screenX;
  touchStartY = event.detail.touches[0].screenY;
}

function onTouchMove(event) {
  const { screenX, screenY } = event.detail.touches[0];

  if (isSwipeY === null) {
    isSwipeY =
      Math.abs(touchStartY - screenY) > Math.abs(touchStartX - screenX);
  }

  if (isSwipeY === false) {
    return;
  }

  deltaY = touchStartY - screenY;

  if (deltaY > 0) {
    // Swiping up.
    return;
  }

  if (!scalingDown) {
    // Set flag so loop doesn't kick off again while it's running.
    scalingDown = true;
    // Start of animate scale.
    animateScale(0);
  }

  isSwipeY = true;
  lightboxEl.style.transform = `translate3d(0, ${Math.pow(
    -deltaY,
    0.6
  )}px, 0) scale3d(${scaleVal}, ${scaleVal}, 1)`;
}
function onTouchEnd() {
  resetAnimationScale();

  lightboxEl.classList.remove('dragging');
  if (isSwipeY === true && Math.abs(deltaY) > toggleThresholdPx) {
    closePlayer();
  } else if (isSwipeY === true) {
    resetStyles();
  }
  isSwipeY = null;
}

function animateScale(val) {
  if (val < 1 && scalingDown) {
    scaleVal = lerp(easeOutQuad(val), 1, 0.95);
    lightboxEl.style.transform = `translate3d(0px, ${Math.pow(
      -deltaY,
      0.6
    )}px, 0) scale3d(${scaleVal}, ${scaleVal}, 1)`;
    requestAnimationFrame(() => animateScale((val += 0.05)));
  }
}

function resetAnimationScale() {
  scalingDown = false;
  scaleVal = 1;
}

export function resetStyles() {
  lightboxEl.style.transform = `translate3d(0, 0, 0) scale3d(1, 1, 1)`;
}

export function initializeCards() {
  lightboxEl.addEventListener('click', () => {
    document.body.classList.toggle('lightbox-open');
  });

  setCards(document.querySelectorAll('.entry-point-card-container'));
  setCardMargin(parseFloat(getComputedStyle(cards[0]).marginRight));
  setCardWidth(cardMargin + cards[0].offsetWidth);

  const stories = player.getStories();

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      player.show(stories[idx].href, /* pageId */ null, { animate: false });
      document.body.classList.toggle('lightbox-open');
      lightboxEl.classList.remove('closed');
      card.classList.add('hidden');

      resetStyles();
      player.play();
    });

    card.addEventListener('mouseenter', () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        return;
      }
    });

    card.addEventListener('mouseleave', () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        return;
      }
    });
  });
}

window.addEventListener('load', () => {
  init();
});

function init() {
  const playerEl = document.body.querySelector('amp-story-player');
  setPlayer(playerEl);

  if (player.isReady) {
    initializeCarousel();
  } else {
    player.addEventListener('ready', () => {
      initializeCarousel();
    });
  }
}

function initializeCarousel() {
  const lightbox = document.body.querySelector('.lightbox');
  setLightbox(lightbox);

  initializeCards();
  initializeArrows();

  player.addEventListener('amp-story-player-close', () => {
    closePlayer();
  });

  // For swipe down to close.
  initializeTouchListeners();
}

export function lerp(pct, v0, v1) {
  return v0 * (1 - pct) + v1 * pct;
}

export function easeOutQuad(t) {
  return --t * t * t + 1;
}

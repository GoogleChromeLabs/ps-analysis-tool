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
let cards;
let cardMargin;
let cardWidth;
let player;
let lightboxEl;
let maxScroll;
let scaleVal = 1;
let scalingDown = false;
let deltaY = 0;

function setPlayer(playerEl) {
  player = playerEl;
}

function setLightbox(lightbox) {
  lightboxEl = lightbox;
}

function setCards(cardEls) {
  cards = cardEls;
}

function setCardWidth(width) {
  cardWidth = width;
}

function setCardMargin(margin) {
  cardMargin = margin;
}

/**
 * Initializes arrows for horizontal scrolling on desktop.
 */
function initializeArrows() {
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

  if (maxScroll < 0) {
    document.querySelector('.carousel-container').classList.add('overflow-right');
  }
}

/**
 * Closes the lightbox and resets the player and UI.
 */
function closePlayer() {
  const data = { storyOpened: false }
  const event = new CustomEvent('webStoriesLightBoxEvent', { detail: data })
  window.parent.document.dispatchEvent(event)
  player.pause();
  document.body.classList.remove('lightbox-open');
  lightboxEl.classList.add('closed');
  cards.forEach((card) => card.classList.remove('hidden'));
}

/**
 * Handles scaling animation during interactions.
 */
function animateScale(val) {
  if (val < 1 && scalingDown) {
    scaleVal = lerp(easeOutQuad(val), 1, 0.95);
    lightboxEl.style.transform = `translate3d(0px, ${Math.pow(
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
  scalingDown = false;
  scaleVal = 1;
  lightboxEl.style.transform = `translate3d(0, 0, 0) scale3d(1, 1, 1)`;
}

/**
 * Initializes card click events and sets up their dimensions.
 */
function initializeCards() {
  setCards(document.querySelectorAll('.entry-point-card-container'));
  setCardMargin(parseFloat(getComputedStyle(cards[0]).marginRight));
  setCardWidth(cardMargin + cards[0].offsetWidth);

  const stories = player.getStories();

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      player.show(stories[idx].href, null, { animate: false });
      const data = { storyOpened: true }
      const event = new CustomEvent('webStoriesLightBoxEvent', { detail: data })
      window.parent.document.dispatchEvent(event)

      document.body.classList.add('lightbox-open');
      lightboxEl.classList.remove('closed');
      card.classList.add('hidden');
      resetStyles();
      player.play();
    });
  });
}

/**
 * Initializes the carousel with the player and cards.
 */
function initializeCarousel() {
  const lightbox = document.body.querySelector('.lightbox');
  setLightbox(lightbox);

  initializeCards();
  initializeArrows();

  player.addEventListener('amp-story-player-close', closePlayer);
}

/**
 * Initializes the player and sets up the carousel.
 */
function init() {
  const playerEl = document.body.querySelector('amp-story-player');
  setPlayer(playerEl);

  if (player.isReady) {
    initializeCarousel();
  } else {
    player.addEventListener('ready', initializeCarousel);
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

// Initialize on window load.
window.addEventListener('load', init);

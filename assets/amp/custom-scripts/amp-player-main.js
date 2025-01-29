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
  cards: null,
  cardMargin: null,
  cardWidth: null,
  player: null,
  lightboxEl: null,
  maxScroll: null,
  scaleVal: 1,
  scalingDown: false,
  deltaY: 0,
  doesHaveMorePages: false,
  previousStories: [],
};

function setPlayer(playerEl) {
  stateObject.player = playerEl;
}

function setLightbox(lightbox) {
  stateObject.lightboxEl = lightbox;
}

function setCards(cardEls) {
  stateObject.cards = cardEls;
}

function setCardWidth(width) {
  stateObject.cardWidth = width;
}

function setCardMargin(margin) {
  stateObject.cardMargin = margin;
}

/**
 * Initializes arrows for horizontal scrolling on desktop.
 */
function initializeArrows() {
  try {
    const scrollContainer = document.querySelector('.carousel-cards-container');
    const containerPadding =
      parseFloat(
        getComputedStyle(scrollContainer.firstElementChild).paddingLeft
      ) +
      parseFloat(
        getComputedStyle(scrollContainer.firstElementChild).paddingRight
      );

    stateObject.maxScroll =
      scrollContainer.offsetWidth -
      containerPadding +
      stateObject.cardMargin -
      stateObject.cards.length * stateObject.cardWidth;

    if (stateObject.maxScroll < 0) {
      document
        .querySelector('.carousel-container')
        .classList.add('overflow-right');
    }
  } catch (error) {
    //Fail silently
  }
}

/**
 * Closes the lightbox and resets the player and UI.
 */
function closePlayer() {
  const data = { storyOpened: false };
  const event = new CustomEvent('webStoriesLightBoxEvent', { detail: data });
  window.parent.document.dispatchEvent(event);

  stateObject.player.pause();
  stateObject.player.rewind();

  document.body.classList.remove('lightbox-open');
  stateObject.lightboxEl.classList.add('closed');
  stateObject.cards.forEach((card) => card.classList.remove('hidden'));
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
 * Initializes card click events and sets up their dimensions.
 */
function initializeCards() {
  try {
    setCards(document.querySelectorAll('.entry-point-card-container'));
    setCardMargin(
      parseFloat(getComputedStyle(stateObject.cards[0]).marginRight)
    );
    setCardWidth(stateObject.cardMargin + stateObject.cards[0].offsetWidth);

    stateObject.cards.forEach((card) => {
      card.addEventListener('click', () => {
        const data = { storyOpened: true };
        const event = new CustomEvent('webStoriesLightBoxEvent', {
          detail: data,
        });
        window.parent.document.dispatchEvent(event);
        stateObject.player.show(card.dataset.storyUrl, null, { animate: false });
        document.body.classList.add('lightbox-open');
        stateObject.lightboxEl.classList.remove('closed');
        card.classList.add('hidden');
        resetStyles();
        stateObject.player.play();
      });
    });
  } catch (error) {
    //Fail silently
    console.log(error);
  }
}

/**
 * Initializes the carousel with the player and cards.
 */
function initializeCarousel() {
  const lightbox = document.body.querySelector('.lightbox');
  setLightbox(lightbox);

  initializeCards();
  initializeArrows();

  const event = new CustomEvent('iframeLoaded');
  window.parent.document.dispatchEvent(event);

  stateObject.player.addEventListener('amp-story-player-close', closePlayer);
}

/**
 * Initializes the player and sets up the carousel.
 */
function init() {
  const playerEl = document.body.querySelector('amp-story-player');
  setPlayer(playerEl);
  stateObject.previousStories = [];

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

const sendEventToParent = () => {
  const event = new CustomEvent('loadMoreData');
  window.parent.document.dispatchEvent(event);
};

function scrollListener() {
  if (
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight
  ) {
    sendEventToParent();
  }

  if (window.scrollY > 0 && !stateObject.doesHaveMorePages) {
    document.getElementById('show-more-indicator').style.display = 'block';
    document.getElementById('show-more-indicator').style.rotate = '180deg';
    document.getElementById('show-more-indicator').onclick = () => {
      document.body.scrollIntoView({ behavior: 'smooth' });
    };
  }

  if (window.scrollY === 0 && !stateObject.doesHaveMorePages) {
    document.getElementById('show-more-indicator').style.display = 'none';
  }
}

const getCardHTML = ({
  heroImage,
  publisherLogo,
  publisherName,
  storyTitle,
  storyUrl,
}) => {
  return `
    <div class="entry-point-card-container" data-story-url="${storyUrl}">
      <div class="background-cards">
        <div class="background-card-1"></div>
        <div class="background-card-2"></div>
      </div>
      <img src="${heroImage}" class="entry-point-card-img" alt="A cat">
      <div class="author-container">
        <div class="logo-container">
            <div class="logo-ring"></div>
            <img class="entry-point-card-logo" src="${publisherLogo}" alt="Publisher logo">
        </div>
        <span class="entry-point-card-subtitle"> By ${publisherName} </span>
      </div>
      <div class="card-headline-container">
          <span class="entry-point-card-headline"> ${storyTitle} </span>
      </div>
    </div>
    `;
};

const messageListener = ({
  data: { story, doesHaveMorePages: _doesHaveMorePages },
}) => {
  try {
    const _cards = story.map(getCardHTML).join('');
    const storyAnchors = story.map(({ storyUrl }) => ({ href: storyUrl }));

    if (JSON.stringify(story) === JSON.stringify(stateObject.previousStories)) {
      return;
    }

    document.getElementById('entry-points').innerHTML = _cards;
    const scrollToNext = stateObject.previousStories.length;
    stateObject.previousStories = story;
    stateObject.player.add(storyAnchors);

    initializeCards();
    initializeArrows();
    stateObject.doesHaveMorePages = _doesHaveMorePages;

    stateObject.cards[scrollToNext].scrollIntoView({ behavior: 'smooth' });

    const distanceToRight = calculateDistanceBetweenLastItemAndBox();
    document.getElementById('show-more-indicator').style.left = `calc(100% - ${
      distanceToRight / 2
    }px)`;

    if (!stateObject.doesHaveMorePages) {
      if (window.scrollY > 0) {
        document.getElementById('show-more-indicator').style.rotate = '180deg';
      } else {
        document.getElementById('show-more-indicator').style.display = 'none';
      }
    } else {
      document.getElementById('show-more-indicator').classList.add('bounce');
      document.getElementById('show-more-indicator').onclick = () => {
        sendEventToParent();
      };
      setTimeout(() => {
        document
          .getElementById('show-more-indicator')
          .classList.remove('bounce');
      }, 2000);
    }
  } catch (error) {
    //Fail silently
  }
};

const calculateDistanceBetweenLastItemAndBox = () => {
  const flexContainer = document.querySelector('.entry-points');
  const flexItems = Array.from(flexContainer.children);

  let lastItemFirstRow = null;

  let firstRowBottom = 0;

  for (let i = 0; i < flexItems.length; i++) {
    const itemRect = flexItems[i].getBoundingClientRect();

    if (i === 0) {
      firstRowBottom = itemRect.bottom;
    }

    if (itemRect.bottom <= firstRowBottom) {
      lastItemFirstRow = flexItems[i];
    } else {
      break;
    }
  }

  // Get the position of the container
  const containerRect = flexContainer.getBoundingClientRect();

  // Calculate the distance from the rightmost part of the container to the last item in the first row
  if (lastItemFirstRow) {
    const lastItemRect = lastItemFirstRow.getBoundingClientRect();
    const distanceToRight = containerRect.right - lastItemRect.right;
    return distanceToRight + 36;
  }
  return null;
};

// Initialize on window load.
window.addEventListener('load', init);
window.addEventListener('scroll', scrollListener);
window.addEventListener('message', messageListener);

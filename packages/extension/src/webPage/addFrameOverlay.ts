/*
 * Copyright 2023 Google LLC
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

const OVERLAY_CLASS = 'ps-overlay';

const createFrameOverlay = (frame: HTMLElement) => {
  const {
    x: frameX,
    y: frameY,
    width: frameWidth,
    height: frameHeight,
  } = frame.getBoundingClientRect();

  if (frameHeight === 0 || frameWidth === 0) {
    return null;
  }

  const frameOverlay = document.createElement('div');
  frameOverlay.classList.add(OVERLAY_CLASS);

  const styles: Record<string, string> = {
    position: 'absolute',
    backgroundColor: '#33be3377',
    zIndex: '2147483647', // max possible z index
    pointerEvents: 'none',
    width: frameWidth + 'px',
    height: frameHeight + 'px',
    top: frameY + Number(window.scrollY) + 'px',
    left: frameX + Number(window.scrollX) + 'px',
  };

  // eslint-disable-next-line guard-for-in
  for (const key in styles) {
    frameOverlay.style[key] = styles[key];
  }

  return frameOverlay;
};

const removeAllOverlays = () => {
  const existingOverlays = Array.from(
    document.getElementsByClassName(OVERLAY_CLASS)
  );

  existingOverlays.forEach((element) => {
    element.parentNode.removeChild(element);
  });
};

const addFrameOverlay = (selectedFrame: string) => {
  const iframes = document.querySelectorAll('iframe');

  // Iterate through each iframe and check its src attribute
  for (const iframe of iframes) {
    const src = iframe.getAttribute('src');

    if (src && src.startsWith(selectedFrame)) {
      removeAllOverlays();

      const overlay = createFrameOverlay(iframe);

      const body = document.querySelector('body');

      if (!body || !overlay) {
        return;
      }

      body.appendChild(overlay);

      iframe.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
};

export default addFrameOverlay;

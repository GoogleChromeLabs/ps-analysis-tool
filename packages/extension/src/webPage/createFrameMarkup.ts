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
/**
 * Internal dependencies.
 */
import getFrameAttributes from './getFrameAttributes';
import isFirstParty from '../utils/isFirstParty';

export const OVERLAY_CLASS = 'ps-overlay';

export const createFrameOverlay = (frame: HTMLElement) => {
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

  const frameInfoBox = createIframeInfoBlock(frame);

  frameOverlay.appendChild(frameInfoBox);

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

const createInfoLine = (label: string, value: string) => {
  const p = document.createElement('p');

  p.style.fontSize = '12px';
  p.style.lineHeight = '1';

  p.innerHTML = `<strong>${label}</strong>: ${value}`;

  return p;
};

export const createIframeInfoBlock = (frame) => {
  const infoBlock = document.createElement('div');
  const attributes = getFrameAttributes(frame);

  const styles: Record<string, string> = {
    backgroundColor: 'white',
    margin: '10px',
    padding: '10px',
    position: 'relative',
    zIndex: '2147483647',
  };

  // eslint-disable-next-line guard-for-in
  for (const key in styles) {
    infoBlock.style[key] = styles[key];
  }

  const origin = new URL(attributes.src || '').origin;

  const info = {
    Type: 'iframe',
    Origin: `<a href="${origin}">${origin}</a>`,
    Title: attributes.title,
    'Is first-party': isFirstParty(origin, window.location.href)
      ? 'true'
      : 'false',
    'Allowed features': attributes.allow,
  };

  // eslint-disable-next-line guard-for-in
  for (const label in info) {
    const value = info[label];

    if (value) {
      infoBlock.appendChild(createInfoLine(label, info[label]));
    }
  }

  console.log(attributes, 'attributes');

  return infoBlock;
};

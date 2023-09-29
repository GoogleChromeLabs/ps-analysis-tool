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
import { INFOBOX_CLASS } from '../../constants';
import getFrameAttributes from '../../utils/getFrameAttributes';
import type { ResponseType } from '../../types';

const createInfoLine = (label: string, value: string): HTMLParagraphElement => {
  const p: HTMLParagraphElement = document.createElement('p');

  p.innerHTML = `<strong style="color:#202124">${label}</strong>: ${value}`;

  return p;
};

export const createIframeInfoBlock = (
  frame: HTMLIFrameElement | HTMLElement,
  data: ResponseType
) => {
  const isMainFrame = document.location.origin === data.selectedFrame;
  let isHidden = false;
  const infoBlock = document.createElement('div');
  const content = document.createElement('div');
  const attributes = isMainFrame
    ? {}
    : getFrameAttributes(frame as HTMLIFrameElement);
  const {
    x: frameX,
    y: frameY,
    width: frameWidth,
    height: frameHeight,
  } = frame.getBoundingClientRect();

  infoBlock.classList.add(INFOBOX_CLASS);
  content.classList.add('content');

  let styles: Record<string, string> = {
    top: frameY + Number(window.scrollY) + 'px',
    left: frameX + Number(window.scrollX) + 'px',
    maxWidth: frameWidth - 40 + 'px',
  };

  if (frameHeight === 0 && frameWidth === 0) {
    isHidden = true;
    styles = {
      top: Number(window.innerHeight) + 'px',
      left: '10px',
      maxWidth: '450px',
      position: 'fixed',
    };
  }

  // eslint-disable-next-line guard-for-in
  for (const key in styles) {
    infoBlock.style[key] = styles[key];
  }

  const frameOrigin = attributes.src ? new URL(attributes.src).origin : '';

  const origin = isMainFrame ? data.selectedFrame : frameOrigin;

  const info: Record<string, string> = {
    Type: 'iframe' + (isHidden ? ' (hidden)' : ''),
    Origin: `<a href="${origin}">${origin}</a>`,
    'First-party cookies': String(data?.firstPartyCookies || '0'),
    'Third-party cookies': String(data?.thirdPartyCookies || '0'),
    'Allowed features': attributes.allow || ' ',
  };

  // eslint-disable-next-line guard-for-in
  for (const label in info) {
    const value = info[label];

    if (value) {
      content.appendChild(createInfoLine(label, value));
    }
  }

  infoBlock.appendChild(content);

  infoBlock.popover = 'manual';

  return infoBlock;
};

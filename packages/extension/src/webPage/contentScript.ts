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
import {
  addFrameOverlay,
  findAndAddFrameOverlay,
  removeAllPopovers,
} from './addFrameOverlay';
import getFrameAttributes from './getFrameAttributes';
import { WEBPAGE_PORT_NAME } from '../constants';
import './style.css';

let port: chrome.runtime.Port | null = null;

const connectPort = () => {
  port = chrome.runtime.connect(chrome.runtime.id, {
    name: WEBPAGE_PORT_NAME,
  });

  port.onDisconnect.addListener(() => {
    port = null;
    // eslint-disable-next-line no-console
    console.log(' Webpage port disconnected!');
  });

  port.onMessage.addListener((response) => {
    if (response?.FrameInspect) {
      if (response.FrameInspect === 'start') {
        attachFrameHighlight();
      } else {
        removeFrameHighlight();
      }
    }
    if (response?.selectedFrame) {
      findAndAddFrameOverlay(response.selectedFrame);
    }

    // eslint-disable-next-line no-console
    console.log(response);
  });
};

chrome.storage.onChanged.addListener((changes: object) => {
  if (changes?.devToolState) {
    if (changes.devToolState?.newValue === 'Ready!' && port === null) {
      // eslint-disable-next-line no-console
      console.log('Connection Attempt!');
      connectPort();
    }
  }
});

const handleMouseEvent = (event: MouseEvent): void => {
  if ((event.target as HTMLElement).tagName === 'IFRAME') {
    const frame = event.target as HTMLIFrameElement;
    // eslint-disable-next-line no-console
    console.log(frame.getAttribute('src'));

    if (!frame.getAttribute('src')) {
      return;
    }

    const payload = {
      hover: event?.type === 'mouseover',
      attributes: getFrameAttributes(frame),
    };

    addFrameOverlay(frame);

    if (port) {
      port.postMessage(payload);
    }
  }
};

const attachFrameHighlight = (): void => {
  document.addEventListener('mouseover', handleMouseEvent);
  document.addEventListener('mouseout', handleMouseEvent);
};

const removeFrameHighlight = (): void => {
  document.removeEventListener('mouseover', handleMouseEvent);
  document.removeEventListener('mouseout', handleMouseEvent);
  removeAllPopovers();
};

// Atempt the connection to devtools
connectPort();

// Remove all popovers and mouse events of extension
document.addEventListener('click', removeFrameHighlight);
document.addEventListener('contextmenu', removeFrameHighlight);

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
import { findAndAddFrameOverlay, removeAllPopovers } from './addFrameOverlay';
import { WEBPAGE_PORT_NAME } from '../constants';
import type { ResponseType } from './types';
import './style.css';

let port: chrome.runtime.Port | null = null;
let isDevToolOpen = false;

const connectPort = () => {
  // Content script has to open the connection, because it doesn't listen to chrome.runtime.onConnect.
  port = chrome.runtime.connect(chrome.runtime.id, {
    name: WEBPAGE_PORT_NAME,
  });

  const onMessage = (response: ResponseType) => {
    if (response.isInspecting) {
      removeHoverEventListeners(); // To avoid duplicate listners.
      addHoverEventListeners();
    } else {
      removeFrameHighlight();
    }

    if (response?.selectedFrame) {
      findAndAddFrameOverlay(response);
    }
  };

  const onDisconnect = () => {
    port?.onMessage.removeListener(onMessage);
    port = null;
    // eslint-disable-next-line no-console
    console.log(' Webpage port disconnected!');
  };

  port.onMessage.addListener(onMessage);
  port.onDisconnect.addListener(onDisconnect);
};

const onStorageChange = async (changes: {
  [key: string]: chrome.storage.StorageChange;
}) => {
  const data = await chrome.storage.local.get();

  const tabId = data?.tabToRead;

  if (!tabId) {
    return;
  }

  const value = changes[tabId].newValue;

  if (isDevToolOpen !== value.isDevToolPSPanelOpen) {
    isDevToolOpen = value.isDevToolPSPanelOpen;

    if (isDevToolOpen) {
      connectPort();
    } else if (port) {
      port.disconnect();
    }
  }
};

const handleHoverEvent = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;

  if (target.tagName !== 'IFRAME') {
    return;
  }

  const frame = target as HTMLIFrameElement;
  const srcAttribute = frame.getAttribute('src');

  if (!srcAttribute) {
    return;
  }

  let url: URL;

  try {
    url = new URL(srcAttribute);
  } catch (err) {
    return;
  }

  const payload = {
    hover: event?.type === 'mouseover',
    attributes: {
      src: url.origin,
    },
  };

  if (!port) {
    return;
  }

  try {
    port.postMessage(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Webpage port disconnected, probably due to inactivity');
  }
};

const addHoverEventListeners = (): void => {
  document.addEventListener('mouseover', handleHoverEvent);
  document.addEventListener('mouseout', handleHoverEvent);
};

const removeHoverEventListeners = (): void => {
  document.removeEventListener('mouseover', handleHoverEvent);
  document.removeEventListener('mouseout', handleHoverEvent);
};

const removeFrameHighlight = (): void => {
  removeHoverEventListeners();
  removeAllPopovers();
};

chrome.storage.local.onChanged.addListener(onStorageChange);

// Remove all popovers and mouse events of extension
document.addEventListener('click', removeFrameHighlight);
document.addEventListener('contextmenu', removeFrameHighlight);

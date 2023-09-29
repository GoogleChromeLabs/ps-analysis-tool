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
import {
  findAndAddFrameOverlay,
  removeAllPopovers,
  addFrameOverlay,
} from './overlay/addFrameOverlay';
import { WEBPAGE_PORT_NAME } from '../constants';
import type { ResponseType } from './types';
import './style.css';

class WebpageContentScript {
  private port: chrome.runtime.Port | null = null;
  private isDevToolOpen = false;
  private isInspecting = false;

  constructor() {
    chrome.storage.local.onChanged.addListener(this.onStorageChange.bind(this));
    document.addEventListener('click', this.removeFrameHighlight.bind(this));
    document.addEventListener(
      'contextmenu',
      this.removeFrameHighlight.bind(this)
    );
  }

  private addHoverEventListeners(): void {
    document.addEventListener('mouseover', this.handleHoverEvent.bind(this));
    document.addEventListener('mouseout', this.handleHoverEvent.bind(this));
  }

  private removeHoverEventListeners(): void {
    document.removeEventListener('mouseover', this.handleHoverEvent.bind(this));
    document.removeEventListener('mouseout', this.handleHoverEvent.bind(this));
  }

  private removeFrameHighlight(): void {
    this.removeHoverEventListeners();
    removeAllPopovers();
  }

  private connectPort() {
    this.port = chrome.runtime.connect(chrome.runtime.id, {
      name: WEBPAGE_PORT_NAME,
    });

    this.port.onMessage.addListener(this.onMessage.bind(this));
    this.port.onDisconnect.addListener(this.onDisconnect.bind(this));
  }

  private onMessage(response: ResponseType) {
    this.isInspecting = response.isInspecting;
    if (response.isInspecting) {
      this.removeHoverEventListeners();
      this.addHoverEventListeners();
    } else {
      this.removeFrameHighlight();
    }

    if (response?.selectedFrame) {
      findAndAddFrameOverlay(response);
    } else if (!response.isInspecting) {
      removeAllPopovers();
    }
  }

  private onDisconnect() {
    this.port?.onMessage.removeListener(this.onMessage);
    this.port = null;
  }

  private async onStorageChange(changes: {
    [key: string]: chrome.storage.StorageChange;
  }) {
    const data = await chrome.storage.local.get();
    const tabId = data?.tabToRead;

    if (!tabId) {
      return;
    }
    if (!changes || !Object.keys(changes).includes(tabId)) {
      return;
    }
    if (!changes[tabId].newValue.isDevToolPSPanelOpen) {
      this.removeFrameHighlight();
    }

    const value = changes[tabId].newValue;

    if (this.isDevToolOpen !== value.isDevToolPSPanelOpen) {
      this.isDevToolOpen = value.isDevToolPSPanelOpen;
      if (this.isDevToolOpen) {
        this.connectPort();
      } else if (this.port) {
        this.port.disconnect();
      }
    }
  }

  private handleHoverEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.isInspecting) {
      return;
    }

    if (target.tagName !== 'IFRAME') {
      return;
    }

    const frame = target as HTMLIFrameElement;
    const srcAttribute = frame.getAttribute('src');

    if (!srcAttribute) {
      addFrameOverlay(frame, {
        isInspecting: true,
        firstPartyCookies: 0,
        thirdPartyCookies: 0,
      });
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

    if (!this.port) {
      return;
    }

    try {
      this.port.postMessage(payload);
    } catch (error) {
      this.removeFrameHighlight();
      // eslint-disable-next-line no-console
      console.log('Webpage port disconnected, probably due to inactivity');
    }
  }
}

// eslint-disable-next-line no-new
new WebpageContentScript();

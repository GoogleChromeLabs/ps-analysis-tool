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
  findSelectedFrameElement,
  removeAllPopovers,
  addPopover,
  toggleFrameHighlighting,
} from './popovers';
import { WEBPAGE_PORT_NAME } from '../constants';
import type { ResponseType } from './types';
import './style.css';

/**
 * Represents the content script for the webpage.
 */
class WebpageContentScript {
  port: chrome.runtime.Port | null = null;
  isDevToolOpen = false;
  isInspecting = false;
  isHoveringOnPage = false;

  /**
   * Initialize
   */
  constructor() {
    this.handleHoverEvent = this.handleHoverEvent.bind(this);
    this.abortInspection = this.abortInspection.bind(this);

    chrome.storage.local.onChanged.addListener(this.onStorageChange.bind(this));
    document.addEventListener('contextmenu', this.abortInspection);
  }

  /**
   * Adds hover event listeners to the document.
   */
  addHoverEventListeners(): void {
    document.addEventListener('mouseover', this.handleHoverEvent);
    document.addEventListener('mouseout', this.handleHoverEvent);
  }

  /**
   * Removes hover event listeners from the document.
   */
  removeHoverEventListeners(): void {
    document.removeEventListener('mouseover', this.handleHoverEvent);
    document.removeEventListener('mouseout', this.handleHoverEvent);
  }

  /**
   * Abort inspection and removes all frame popovers and hover event listeners.
   */
  abortInspection(): void {
    this.removeHoverEventListeners();
    removeAllPopovers();
    toggleFrameHighlighting(false);

    try {
      if (this.port) {
        this.port.disconnect();
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  /**
   * Connects to the chrome runtime port.
   */
  connectPort() {
    this.port = chrome.runtime.connect(chrome.runtime.id, {
      name: WEBPAGE_PORT_NAME,
    });

    this.port.onMessage.addListener(this.onMessage.bind(this));
    this.port.onDisconnect.addListener(this.onDisconnect.bind(this));
  }

  /**
   * Handles incoming messages from the connected port.
   * @param {ResponseType} response - The incoming message/response from the port.
   */
  onMessage(response: ResponseType) {
    this.isInspecting = response.isInspecting;

    if (response.isInspecting) {
      this.removeHoverEventListeners();
      this.addHoverEventListeners();
      toggleFrameHighlighting(true);

      if (response?.selectedFrame) {
        const frameElement = findSelectedFrameElement(response.selectedFrame);

        if (frameElement) {
          addPopover(frameElement, response, this.isHoveringOnPage);
        } else {
          removeAllPopovers();
        }
      }
    } else {
      this.abortInspection();
    }
  }

  /**
   * Handles the port disconnection event.
   */
  onDisconnect() {
    this.port?.onMessage.removeListener(this.onMessage);
    this.port = null;
    this.abortInspection();
  }

  /**
   * Handles the storage change events.
   * @async
   * @param {{[key: string]: chrome.storage.StorageChange}} changes - The object representing the storage changes.
   */
  async onStorageChange(changes: {
    [key: string]: chrome.storage.StorageChange;
  }) {
    const data = await chrome.storage.local.get(); // Because we do not know tab id yet.
    const tabId = data?.tabToRead;

    if (!tabId || !changes || !Object.keys(changes).includes(tabId)) {
      return;
    }

    // Its important to use changes newValue for latest data.
    if (!changes[tabId].newValue?.isDevToolPSPanelOpen) {
      this.abortInspection();
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

  /**
   * Handles hover events, focusing on IFRAME elements when inspecting is enabled.
   * @param {MouseEvent} event - The mouse event triggered by user action.
   */
  handleHoverEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    this.isHoveringOnPage = false;

    if (!this.isInspecting || target.tagName !== 'IFRAME') {
      return;
    }

    this.isHoveringOnPage = true;

    const frame = target as HTMLIFrameElement;
    const srcAttribute = frame.getAttribute('src');

    if (!srcAttribute) {
      addPopover(
        frame,
        {
          isInspecting: true,
        },
        this.isHoveringOnPage
      );

      return;
    }

    let url: URL;

    try {
      url = new URL(srcAttribute);
    } catch (error) {
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
      this.abortInspection();
      // eslint-disable-next-line no-console
      console.log(
        'Webpage port disconnected, probably due to inactivity',
        error
      );
    }
  }
}

// eslint-disable-next-line no-new
new WebpageContentScript();

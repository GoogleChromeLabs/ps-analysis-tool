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
  findSelectedFrameElements,
  removeAllPopovers,
  addPopover,
  toggleFrameHighlighting,
} from './popovers';
import { WEBPAGE_PORT_NAME } from '../constants';
import type { ResponseType } from './types';
import './style.css';
import { CookieStore } from '../localStore';
import { setOverlayPosition } from './popovers/overlay';
import { setTooltipPosition } from './popovers/tooltip';

/**
 * Represents the content script for the webpage.
 */
class WebpageContentScript {
  port: chrome.runtime.Port | null = null;
  isInspecting = false;
  isHoveringOverPage = false;
  scrollEventListeners: Array<() => void> | [] = [];

  /**
   * Initialize
   */
  constructor() {
    this.handleHoverEvent = this.handleHoverEvent.bind(this);
    this.abortInspection = this.abortInspection.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.listenToConnection();
    this.setTopics();
  }

  listenToConnection() {
    chrome.runtime.onConnect.addListener((port) => {
      if (!port.name.startsWith(WEBPAGE_PORT_NAME)) {
        return;
      }

      this.port = port;

      this.port.onMessage.addListener(this.onMessage);
      this.port.onDisconnect.addListener(this.onDisconnect);
    });
  }

  /**
   * Adds hover event listeners to the document.
   */
  addHoverEventListeners(): void {
    document.addEventListener('mouseover', this.handleHoverEvent);
    document.addEventListener('mouseout', this.handleHoverEvent);
    document.addEventListener('visibilitychange', this.handleMouseMove);

    document.documentElement.addEventListener(
      'mouseleave',
      this.handleMouseMove
    );
    document.documentElement.addEventListener(
      'mouseenter',
      this.handleMouseMove
    );
  }

  /**
   * Removes hover event listeners from the document.
   */
  removeHoverEventListeners(): void {
    document.removeEventListener('mouseover', this.handleHoverEvent);
    document.removeEventListener('mouseout', this.handleHoverEvent);
    document.removeEventListener('visibilitychange', this.handleMouseMove);

    document.documentElement.removeEventListener(
      'mouseleave',
      this.handleMouseMove
    );
    document.documentElement.removeEventListener(
      'mouseenter',
      this.handleMouseMove
    );
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
      this.insertPopovers(response);
    } else {
      this.abortInspection();
    }
  }

  insertPopovers(response: ResponseType) {
    if (!response.selectedFrame) {
      return;
    }

    const frameElements = findSelectedFrameElements(response.selectedFrame);

    // Remove previous frames.
    this.removeAllPopovers();

    if (!frameElements.length) {
      return;
    }

    // Its important to insert overlays and tooltips seperately and in the same order, to avoid z-index issue.
    frameElements.forEach((frame) => {
      this.insertOverlay(frame, response);
    });

    let firstToolTip: HTMLElement | null = null;

    frameElements.forEach((frame, index) => {
      const tooltip = this.insertTooltip(frame, response);

      if (0 === index) {
        firstToolTip = tooltip;
      }
    });

    const frameToScrollTo = frameElements[0];

    if (
      firstToolTip &&
      !this.isHoveringOverPage &&
      frameToScrollTo.clientWidth
    ) {
      (firstToolTip as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  insertOverlay(frame: HTMLElement, response: ResponseType) {
    const overlay = addPopover(frame, response, 'overlay');

    const updatePosition = () => {
      setOverlayPosition(overlay, frame);
    };

    this.addEventListerOnScroll(updatePosition);

    return overlay;
  }

  insertTooltip(
    frame: HTMLElement,
    response: ResponseType
  ): HTMLElement | null {
    const tooltip = addPopover(frame, response, 'tooltip');

    const updatePosition = () => {
      const isHidden = !frame.clientWidth;
      setTooltipPosition(tooltip, frame, isHidden, response.selectedFrame);
    };

    this.addEventListerOnScroll(updatePosition);

    return tooltip;
  }

  addEventListerOnScroll(callback: () => void) {
    this.scrollEventListeners.push(callback);

    callback();

    window.addEventListener('scroll', callback);
  }

  removeAllPopovers() {
    if (this.scrollEventListeners.length) {
      this.scrollEventListeners.forEach((listener) => {
        window.removeEventListener('scroll', listener);
      });

      this.scrollEventListeners = [];
    }

    removeAllPopovers();
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
   * Abort inspection and removes all frame popovers and hover event listeners.
   */
  abortInspection(): void {
    this.removeHoverEventListeners();
    removeAllPopovers();
    toggleFrameHighlighting(false);
    this.isInspecting = false;
  }

  /**
   * Handles hover events, focusing on IFRAME elements when inspecting is enabled.
   * @param {MouseEvent} event - The mouse event triggered by user action.
   */
  handleHoverEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isNonIframeElement = target.tagName !== 'IFRAME';

    this.isHoveringOverPage = true;

    if (this.isInspecting && isNonIframeElement && this.port) {
      removeAllPopovers();

      this.port.postMessage({
        attributes: {
          iframeOrigin: '',
        },
      });
    }

    if (!this.isInspecting || target.tagName !== 'IFRAME') {
      return;
    }

    const frame = target as HTMLIFrameElement;
    const srcAttribute = frame.getAttribute('src');

    if (!srcAttribute) {
      this.removeAllPopovers();

      this.insertOverlay(frame, {
        isInspecting: true,
      });

      this.insertTooltip(frame, {
        isInspecting: true,
      });
    }

    let url: URL | '';

    try {
      url = srcAttribute ? new URL(srcAttribute) : '';
    } catch (error) {
      return;
    }

    if (!this.port) {
      return;
    }

    try {
      this.port.postMessage({
        attributes: {
          iframeOrigin: url ? url.origin : '',
        },
      });
    } catch (error) {
      this.abortInspection();
    }
  }

  /**
   * Toggle this.isHoveringOverPage state when mouse or visibility is changed.
   * @param {MouseEvent} event Mouse event.
   */
  handleMouseMove(event?: MouseEvent) {
    if (event?.type === 'mouseenter') {
      this.isHoveringOverPage = true;
    } else if (event?.type === 'mouseleave') {
      this.isHoveringOverPage = false;
    }

    if (document.hidden) {
      this.isHoveringOverPage = false;
    }
  }

  /**
   * Set topics to be used in the Topics landing page.
   */
  async setTopics() {
    if (
      !document.prerendering &&
      'browsingTopics' in document &&
      document.featurePolicy &&
      document.featurePolicy.allowsFeature('browsing-topics')
    ) {
      const activeTabUrl = window.location.origin;
      const topicsObjArr = await document.browsingTopics();
      const topicsIdArr = topicsObjArr.map(
        (topic: { [key: string]: string | number }) => topic.topic
      );

      CookieStore.setTopics(activeTabUrl, topicsIdArr);
    }
  }
}

// eslint-disable-next-line no-new
new WebpageContentScript();

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
 * External dependencies
 */
import {
  type CookieData,
  findAnalyticsMatch,
  calculateEffectiveExpiryDate,
  type CookieDatabase,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import {
  DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
  GET_JS_COOKIES,
  TABID_STORAGE,
} from '../constants';
import { fetchDictionary } from '../utils/fetchCookieDictionary';
import processAndStoreDocumentCookies from '../utils/processAndStoreDocumentCookies';

/**
 * Represents the webpage's content script functionalities.
 */
class WebpageContentScript {
  /**
   * TabId of the current Tab
   */
  tabId: number | null = null;

  /**
   * Frame id.
   */
  frameId: string | null = null;

  /**
   * TabId of the current Tab
   */
  cookieDB: CookieDatabase | null = null;

  /**
   * Initialize.
   */
  constructor() {
    this.listenToConnection();
  }

  /**
   * Listens for connection requests from devtool.
   */
  async listenToConnection() {
    // Message once on initialize, to let the devtool know that content script has loaded.
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({
        setInPage: true,
      });
    }

    chrome.runtime.onMessage.addListener(async (message, _sender, response) => {
      if (message.status === 'set?') {
        response({ setInPage: true });
        await this.getAndProcessJSCookies(message.tabId);
      }

      if (
        typeof message.PSATDevToolsHidden !== 'undefined' &&
        //@ts-ignore
        typeof cookieStore !== 'undefined'
      ) {
        if (message.PSATDevToolsHidden) {
          //@ts-ignore
          cookieStore.onchange = null;
        } else {
          //@ts-ignore
          cookieStore.onchange = this.handleCookieChange;
          await this.getAndProcessJSCookies(message.tabId);
        }
      }

      if (message?.payload?.type === TABID_STORAGE) {
        this.tabId = message.payload.tabId;
        this.frameId = message.payload.frameId;
        //@ts-ignore
        if (typeof cookieStore !== 'undefined') {
          //@ts-ignore
          cookieStore.onchange = this.handleCookieChange;
          await this.getAndProcessJSCookies(message.tabId);
        }
      }

      if (message?.payload?.type === GET_JS_COOKIES) {
        await this.getAndProcessJSCookies(message.payload.tabId);
      }
    });

    if (!this.cookieDB) {
      this.cookieDB = await fetchDictionary();
    }
  }

  /**
   * This function will fetch and add cookies that have been set via JS.
   * @param tabId The tabID whose cookies have to be fetched.
   */
  async getAndProcessJSCookies(tabId: string) {
    try {
      if (this.frameId === null) {
        return;
      }
      //@ts-ignore
      const jsCookies = await cookieStore?.getAll();

      await processAndStoreDocumentCookies({
        tabUrl: window.location.href,
        tabId,
        frameId: this.frameId,
        documentCookies: jsCookies,
        cookieDB: this.cookieDB ?? {},
      });
    } catch (error) {
      //Fail silently. No logging because sometimes cookieStore.getAll fails to run in some context.
    }
  }

  /**
   * Handle cookie change event.
   * @param event Event fired at a CookieStore when any cookie changes occur
   */
  //@ts-ignore
  handleCookieChange = (event: CookieChangedEvent) => {
    if (!chrome.runtime?.id) {
      return;
    }

    if (
      event.type !== 'change' ||
      (event.changed && event.changed.length === 0) ||
      !this.cookieDB
    ) {
      return;
    }
    try {
      const jsCookies = [];
      for (const cookie of event.changed) {
        if (!cookie.name || !cookie.path) {
          return;
        }
        let domain = cookie.domain;

        if (cookie.domain) {
          domain = cookie.domain?.startsWith('.')
            ? cookie.domain
            : '.' + cookie.domain;
        } else {
          domain = window.location.hostname;
        }

        const encoder = new TextEncoder();

        const singleCookie: CookieData = {
          parsedCookie: {
            ...cookie,
            expires: calculateEffectiveExpiryDate(cookie?.expires),
            partitionKey: cookie?.partitioned,
            size: encoder.encode(cookie.name + cookie.value).length,
            domain,
          },
          networkEvents: {
            requestEvents: [],
            responseEvents: [],
          },
          analytics: findAnalyticsMatch(cookie?.name, this.cookieDB),
          url: window.location.href,
          headerType: 'javascript',
          frameIdList: [this.frameId?.toString() ?? '0'],
          blockedReasons: [],
          warningReasons: [],
          isBlocked: false,
          isFirstParty: true,
        };

        jsCookies.push(singleCookie);
      }

      if (jsCookies.length === 0) {
        return;
      }

      chrome.runtime.sendMessage({
        type: DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
        payload: {
          tabId: this.tabId,
          cookieData: jsCookies,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  };
}

// eslint-disable-next-line no-new
new WebpageContentScript();

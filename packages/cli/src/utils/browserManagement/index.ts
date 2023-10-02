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

import puppeteer, { Browser, Frame } from 'puppeteer';
import {
  BlockedCookie,
  BlockedCookies,
  Cookie,
  CookieDatabase,
  CookieLogDetails,
  Job,
  ResponseReceived,
  ResponseReceivedExtraInfo,
  UniqueCookiesLogDetail,
} from '../../types';
import { fetchDictionary } from '../fetchCookieDictionary';
import delay from '../delay';
import AsyncQueue from '../asyncQueue';
import Utility from '../utility';
import CookiesManagement from '../cookiesManagement';

export type BrowserManagementOptions = {
  isHeadless: boolean;
  profilePath: string;
  shouldBlock3pCookies: boolean;
};

export default class BrowserManagement extends AsyncQueue {
  private browser: Browser | null = null;
  private cookieDictionary: CookieDatabase = {};
  private static SETTINGS_PAGE_TIMEOUT = 100000;

  public async initialize(options: BrowserManagementOptions) {
    const {
      isHeadless,
      profilePath,
      shouldBlock3pCookies,
    }: BrowserManagementOptions = options;

    this.browser = await puppeteer.launch({
      devtools: true,
      headless: isHeadless ? 'new' : false,
      args: [`--user-data-dir=${profilePath}`],
    });

    if (shouldBlock3pCookies) {
      await this.block3pCookies();
    }

    this.cookieDictionary = await fetchDictionary();
  }

  public async deinitialize() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  private async block3pCookies(): Promise<void> {
    if (!this.browser) {
      throw new Error('The browser is not initialized');
    }

    const cookiesPage = await this.browser.newPage();
    await cookiesPage.goto('chrome://settings/cookies', {
      timeout: BrowserManagement.SETTINGS_PAGE_TIMEOUT,
    });

    const radioButton = await cookiesPage.$(
      'settings-ui >>> settings-main >>> settings-basic-page >>> settings-section settings-privacy-page >>> settings-cookies-page >>> #blockThirdParty >>> #label'
    );

    if (radioButton) {
      //@ts-ignore
      await radioButton.evaluate((b) => b.click());
    }

    await cookiesPage.close();
  }

  public async process(job: Job): Promise<any> {
    const output: any = await this.getCookiesByUrl(job.data);
    return output;
  }

  public async getCookiesByUrl(url: string): Promise<Array<CookieLogDetails>> {
    if (!this.browser) {
      return [];
    }

    /**
     * Variables.
     */
    let allCookies: UniqueCookiesLogDetail = {};
    let allBlockedCookies: BlockedCookies = [];
    const uniqueBlockedCookies: { [key: string]: BlockedCookie } = {};
    const requestURLs: { [key: string]: string } = {};
    const frameURLs: { [key: string]: string } = {};

    /**
     * Open page in incognito mode.
     */
    const page = await this.browser.newPage();

    const cdpSession = await page.createCDPSession();
    await cdpSession.send('Network.enable');

    const mainFrame = page.mainFrame();
    // @ts-ignore
    const mainFrameID = mainFrame._id;

    /**
     * For cookies details.
     */
    cdpSession.on(
      'Network.responseReceivedExtraInfo',
      (response: ResponseReceivedExtraInfo) => {
        if (!response.requestId) {
          return;
        }

        const requestID: string = response.requestId;
        const partitionKey: string = response.cookiePartitionKey ?? '';

        // Collect all blocked cookies.
        if (response.blockedCookies) {
          // @ts-ignore
          allBlockedCookies = [
            ...allBlockedCookies,
            ...response.blockedCookies,
          ];
        }

        if (!Object.keys(response.headers).includes('set-cookie')) {
          return;
        }

        const parsedCookies = Utility.parseCookies(
          response.headers['set-cookie']
        );

        parsedCookies.filter((theCookie: Cookie) => {
          if (!theCookie.name) {
            return false;
          }

          const cookieKey: string = CookiesManagement.getCookieKey(theCookie);

          // @ts-ignore
          const cookie: CookieLogDetails = allCookies[cookieKey]
            ? allCookies[cookieKey]
            : { ...theCookie };

          cookie.partitionKey = partitionKey;
          cookie.requestUrls = cookie.requestUrls ?? {};

          /**
           * Mark that the cookie has been added by current request ID. (URL will update in another URL)
           */
          cookie.requestUrls[requestID] = 'Unknown';

          allCookies[cookieKey] = cookie;
          return cookie;
        });
      }
    );

    /**
     * For request detail.
     */
    cdpSession.on('Network.responseReceived', (response: ResponseReceived) => {
      if (!response.requestId) {
        return;
      }

      const requestID: string = response.requestId;
      const requestURL: string = response.response.url ?? '';
      let frameID: string = response.frameId ?? '';

      // Collect request URLs by request ID.
      requestURLs[requestID] = requestURL;

      // If there is no frame then let's just assume it's main frame.
      if (!frameID) {
        frameID = mainFrameID;
      }

      // eslint-disable-next-line guard-for-in
      for (const cookiesKey in allCookies) {
        if (allCookies[cookiesKey] && !allCookies[cookiesKey].requestUrls) {
          allCookies[cookiesKey].requestUrls = {};
        }

        /**
         * Only add frame ID to cookies.
         * Which has been added by current request.
         */
        if (
          requestURL &&
          allCookies[cookiesKey] &&
          requestID in allCookies[cookiesKey].requestUrls
        ) {
          // Add URL of frame.
          allCookies[cookiesKey].frameUrls =
            allCookies[cookiesKey].frameUrls ?? {};
          allCookies[cookiesKey].frameUrls[frameID] = 'Unknown';
        }
      }
    });

    await page.goto(url, {
      timeout: BrowserManagement.SETTINGS_PAGE_TIMEOUT,
    });

    await delay(1000);

    await page.evaluate(() => {
      window.scrollBy(0, 10000);
    });

    await delay(6000);

    /**
     * Get Frame detail.
     */
    const frames = page.frames();
    const frameCallback = (frame: Frame) => {
      // @ts-ignore
      if (frame._id) {
        // @ts-ignore
        frameURLs[frame._id] = frame.url();
      }

      if (frame.childFrames()) {
        frame.childFrames().forEach(frameCallback);
      }
    };

    frames.forEach(frameCallback);

    /**
     * Prepare blocked cookies.
     */
    allBlockedCookies.forEach((blockedCookie: BlockedCookie) => {
      if (!blockedCookie.cookie) {
        blockedCookie.cookie = Utility.parseCookieLine(
          blockedCookie.cookieLine
        );
      }

      const cookieKey = CookiesManagement.getCookieKey(blockedCookie.cookie);
      uniqueBlockedCookies[cookieKey] = blockedCookie;
    });

    /**
     * Merge all the cookies.
     */
    const pageCookies = await page.cookies();
    const pageCookiesObject = CookiesManagement.getUniqueObject(pageCookies);

    // @ts-ignore
    allCookies = Utility.mergeObjects(pageCookiesObject, allCookies);

    // Close the page.
    await page.close();

    // eslint-disable-next-line guard-for-in
    for (const cookieKey in allCookies) {
      let cookie: CookieLogDetails | null = allCookies[cookieKey];
      if (!cookie.domain) {
        const urlObject = new URL(url);
        cookie.domain = urlObject.hostname;
      }

      cookie = CookiesManagement.normalizeCookie(cookie, url);
      if (!cookie) {
        continue;
      }

      cookie.pageUrl = url;
      cookie.isBlocked = false;
      cookie.blockedReasons = [];

      if (uniqueBlockedCookies[cookieKey]) {
        cookie.isBlocked = true;
        cookie.blockedReasons = uniqueBlockedCookies[cookieKey].blockedReasons;
      }

      // Update request URLs.
      for (const requestID in cookie.requestUrls) {
        if (requestURLs[requestID]) {
          cookie.requestUrls[requestID] = requestURLs[requestID];
        }
      }

      // Update frame URLs.
      for (const frameID in cookie.frameUrls) {
        if (frameURLs[frameID]) {
          cookie.frameUrls[frameID] = frameURLs[frameID];
        }
      }

      allCookies[cookieKey] = cookie;
    }

    return Object.values(allCookies);
  }
}

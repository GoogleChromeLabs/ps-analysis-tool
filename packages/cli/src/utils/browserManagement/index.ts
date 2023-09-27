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
  RequestDetail,
  RequestDetails,
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
     * Open page in incognito mode.
     */
    const page = await this.browser.newPage();

    const cdpSession = await page.createCDPSession();

    await cdpSession.send('Network.enable');

    const requestDetails: RequestDetails = {};
    let allBlockedCookies: BlockedCookies = [];
    const defaultRequestDetail: RequestDetail = {
      requestID: '',
      frameID: '',
      type: '',
      url: '',
      frameURL: '',
      allCookies: [],
      blockedCookies: [],
      acceptedCookies: [],
    };

    /**
     * For cookies details.
     */
    cdpSession.on('Network.responseReceivedExtraInfo', (response) => {
      if (!response.requestId) {
        return;
      }

      const requestID: string = response.requestId;
      const partitionKey: string = response.cookiePartitionKey;
      const requestDetail: RequestDetail = requestDetails[requestID] ?? {
        ...defaultRequestDetail,
      };

      if (Object.keys(response.headers).includes('set-cookie')) {
        const parsedCookies = Utility.parseCookies(
          response.headers['set-cookie']
        );

        requestDetail.allCookies = parsedCookies.filter((cookie: Cookie) => {
          cookie.partitionKey = partitionKey;
          return cookie;
        });
      }

      if (response.blockedCookies) {
        requestDetail.blockedCookies = response.blockedCookies;

        allBlockedCookies = [...allBlockedCookies, ...response.blockedCookies];
      }

      requestDetails[requestID] = requestDetail;
    });

    /**
     * For request detail.
     */
    cdpSession.on('Network.responseReceived', (response) => {
      if (!response.requestId) {
        return;
      }

      const requestID: string = response.requestId;
      const requestDetail: RequestDetail = requestDetails[requestID] ?? {
        ...defaultRequestDetail,
      };

      requestDetail.requestID = requestID;
      requestDetail.frameID = response.frameId;
      requestDetail.type = response.type;
      requestDetail.url = response.response.url;

      requestDetails[requestID] = requestDetail;
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
    const frameUrls: { [key: string]: string } = {};

    const frameCallback = (frame: Frame) => {
      // @ts-ignore
      if (frame._id) {
        // @ts-ignore
        frameUrls[frame._id] = frame.url();
      }

      if (frame.childFrames()) {
        frame.childFrames().forEach(frameCallback);
      }
    };

    frames.forEach(frameCallback);

    const uniqueAllCookies: UniqueCookiesLogDetail = {};

    // Close the page.
    await page.close();

    const uniqueBlockedCookies: { [key: string]: BlockedCookie } = {};

    // eslint-disable-next-line guard-for-in
    for (const requestDetailsKey in requestDetails) {
      const requestDetail = requestDetails[requestDetailsKey];

      if (!requestDetail.requestID) {
        continue;
      }

      // Make a list of blocked cookies.
      const blockedCookies = [];
      for (const blockedCookie of requestDetail.blockedCookies) {
        const cookie: Cookie = Utility.parseCookieLine(
          blockedCookie.cookieLine
        );
        blockedCookies.push(cookie);

        const key = CookiesManagement.getCookieKey(cookie);
        uniqueBlockedCookies[key] = blockedCookie;
      }

      // Merge all cookies with frame ID
      requestDetail.allCookies.map((cookie: Cookie) => {
        const key = CookiesManagement.getCookieKey(cookie);
        if (!cookie.domain) {
          const urlObject = new URL(requestDetail.url);
          cookie.domain = urlObject.hostname;
        }

        const normalizedCookies = CookiesManagement.normalizeCookie(
          cookie,
          url
        );
        if (normalizedCookies) {
          uniqueAllCookies[key] = {
            ...normalizedCookies,
            pageUrl: url,
            frameUrl: frameUrls[requestDetail.frameID] ?? '',
            isBlocked: false,
            blockedReasons: [],
          };
        }

        return null;
      });

      const cookiesDiff = CookiesManagement.getDiff(
        requestDetail.allCookies,
        blockedCookies
      );

      requestDetails[requestDetailsKey].frameURL =
        frameUrls[requestDetail.frameID] ?? '';
      requestDetails[requestDetailsKey].acceptedCookies =
        cookiesDiff.availableInFirst;
    }

    // eslint-disable-next-line guard-for-in
    for (const key in uniqueAllCookies) {
      const blockedCookie: BlockedCookie | null =
        uniqueBlockedCookies[key] ?? null;

      if (blockedCookie) {
        uniqueAllCookies[key].isBlocked = true;
        uniqueAllCookies[key].blockedReasons = blockedCookie.blockedReasons;
      }
    }

    return Object.values(uniqueAllCookies);
  }
}

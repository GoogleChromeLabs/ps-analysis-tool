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
 * External dependencies.
 */
import puppeteer, { Browser, Page, Protocol } from 'puppeteer';
import { parse } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import { ResponseData, RequestData, ViewportConfig } from './types';
import { parseNetworkDataToCookieData } from './parseNetworkDataToCookieData';
import delay from '../delay';
import { CookieData, UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';

export class BrowserManagement {
  viewportConfig: ViewportConfig;
  browser: Browser | null;
  isHeadless: boolean;
  pageWaitTime: number;
  pageMap: Map<string, Page>;
  pageResponseMaps: Map<string, Map<string, ResponseData>>;
  pageRequestMaps: Map<string, Map<string, RequestData>>;
  shouldLogDebug: boolean;

  constructor(
    viewportConfig: ViewportConfig,
    isHeadless: boolean,
    pageWaitTime: number,
    shouldLogDebug: boolean
  ) {
    this.viewportConfig = viewportConfig;
    this.browser = null;
    this.isHeadless = isHeadless;
    this.pageWaitTime = pageWaitTime;
    this.pageMap = new Map();
    this.pageResponseMaps = new Map();
    this.pageRequestMaps = new Map();
    this.shouldLogDebug = shouldLogDebug;
  }

  debugLog(msg: any) {
    if (this.shouldLogDebug) {
      console.log(msg);
    }
  }

  async initializeBrowser(enable3pCookiePhaseout: boolean) {
    const args = [];

    if (enable3pCookiePhaseout) {
      args.push('--test-third-party-cookie-phaseout');
    }

    this.browser = await puppeteer.launch({
      devtools: true,
      headless: this.isHeadless ? 'new' : false,
      args,
    });
    this.debugLog('browser intialized');
  }

  async clickOnAcceptBanner(sitePage: Page) {
    const buttonHandlersName = [
      'onetrust-accept-btn-handler',
      'truste-consent-button',
    ];

    let bannerAccepted = false;

    await Promise.all(
      buttonHandlersName.map(async (handler) => {
        const acceptAllCookiesBanner = await sitePage.$(
          `button[id="${handler}"]`
        );

        if (acceptAllCookiesBanner && !bannerAccepted) {
          await acceptAllCookiesBanner.evaluate((button) => {
            button?.click();
          });
          bannerAccepted = true;
        }

        return handler;
      })
    );

    if (bannerAccepted) {
      this.debugLog('Found and accepted all cookies in GDPR banner');
    } else {
      this.debugLog('Couldnt find accept GDPR banner');
    }
  }

  async openPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not intialized');
    }
    const sitePage = await this.browser.newPage();

    await sitePage.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );

    sitePage.setViewport({
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    });
    this.debugLog('Page opened');

    return sitePage;
  }

  async navigateAndScroll(url: string) {
    const page = this.pageMap.get(url);
    if (!page) {
      throw new Error('no page with the provided id was found');
    }
    this.debugLog(`starting navigation to url ${url}`);
    try {
      await page.goto(url, { timeout: 10000 });
    } catch (error) {
      this.debugLog(
        `navigation did not finish in 10 seconds moving on to scrolling`
      );
      //ignore
    }
    await this.clickOnAcceptBanner(page);
    await delay(this.pageWaitTime / 2);

    await page.evaluate(() => {
      window.scrollBy(0, 10000);
    });

    await delay(this.pageWaitTime / 2);
    this.debugLog(`done navigating and scrolling to url:${url}`);
  }

  async attachNetworkListenersToPage(pageId: string) {
    const page = this.pageMap.get(pageId);
    if (!page) {
      throw new Error(`no page with the provided id was found:${pageId}`);
    }
    const cdpSession = await page.createCDPSession();
    await cdpSession.send('Network.enable');
    //@ts-ignore
    const mainFrameId: string = page.mainFrame()._id;

    const responseMap: Map<string, ResponseData> = new Map();
    this.pageResponseMaps.set(pageId, responseMap);

    cdpSession.on(
      'Network.responseReceived',
      (response: Protocol.Network.ResponseReceivedEvent) => {
        responseMap.set(response.requestId, {
          frameId: response.frameId || mainFrameId,
          serverUrl: response.response.url,
          cookies: responseMap.get(response.requestId)?.cookies || [],
        });
      }
    );

    cdpSession.on(
      'Network.responseReceivedExtraInfo',
      (event: Protocol.Network.ResponseReceivedExtraInfoEvent) => {
        if (!event.headers['set-cookie']) {
          return;
        }
        const cookies = event.headers['set-cookie']
          .split('\n')
          .map((headerLine) => {
            const parsedCookie = parse(headerLine);
            const partitionKey = headerLine.includes('Partitioned')
              ? event.cookiePartitionKey
              : undefined;

            const blockedEntry = event.blockedCookies.find((c) => {
              return c.cookie?.name === parsedCookie.name;
            });

            return {
              parsedCookie: {
                name: parsedCookie.name,
                domain: parsedCookie.domain,
                path: parsedCookie.path || '/',
                value: parsedCookie.value,
                sameSite: parsedCookie.samesite || 'Lax',
                expires: parsedCookie.expires || 'Session',
                httpOnly: parsedCookie.httponly || false,
                secure: parsedCookie.secure || false,
                partitionKey,
              },
              isBlocked: Boolean(blockedEntry),
              blockedReasons: blockedEntry?.blockedReasons,
            };
          });

        const prevCookies = responseMap.get(event.requestId)?.cookies || [];
        const mergedCookies = [...prevCookies, ...(cookies || [])];

        responseMap.set(event.requestId, {
          frameId: responseMap.get(event.requestId)?.frameId || '',
          serverUrl: responseMap.get(event.requestId)?.serverUrl || '',
          // @ts-ignore TODO: fix expires type mismatch
          cookies: mergedCookies,
        });
      }
    );

    const requestMap = new Map();
    this.pageRequestMaps.set(pageId, requestMap);

    cdpSession.on('Network.requestWillBeSent', (request) => {
      requestMap.set(request.requestId, {
        ...(requestMap.get(request.requestId) || {}),
        frameId: request.frameId,
        serverUrl: request.request.url,
      });
    });

    cdpSession.on(
      'Network.requestWillBeSentExtraInfo',
      (event: Protocol.Network.RequestWillBeSentExtraInfoEvent) => {
        if (event.associatedCookies && event.associatedCookies.length !== 0) {
          const cookies = event.associatedCookies.map((associatedCookie) => {
            return {
              parsedCookie: {
                name: associatedCookie.cookie.name,
                domain: associatedCookie.cookie.domain,
                path: associatedCookie.cookie.path || '/',
                value: associatedCookie.cookie.value,
                sameSite: associatedCookie.cookie.sameSite || 'Lax',
                expires: associatedCookie.cookie.expires || 'Session',
                httpOnly: associatedCookie.cookie.httpOnly || false,
                secure: associatedCookie.cookie.secure || false,
                partitionKey: associatedCookie.cookie.partitionKey,
              },
              isBlocked: associatedCookie.blockedReasons.length > 0,
              blockedReasons: associatedCookie.blockedReasons,
            };
          });
          requestMap.set(event.requestId, {
            ...(requestMap.get(event.requestId) || {}),
            cookies,
          });
        }
      }
    );

    this.debugLog('done attaching network event listeners');
  }

  getPageFrameIdToUrlMap(id: string) {
    const page = this.pageMap.get(id);
    if (!page) {
      throw new Error('no page with the provided id was found');
    }
    const frameIdMapFromTree = new Map();
    const frames = page.frames();
    const frameCallback = (frame: any) => {
      const frameId = frame._id;
      const _url = frame.url();
      frameIdMapFromTree.set(frameId, _url);

      if (frame.childFrames()) {
        frame.childFrames().forEach(frameCallback);
      }
    };

    frames.forEach(frameCallback);
    return frameIdMapFromTree;
  }

  async analyzeCookieUrls(urls: string[]) {
    for (const url of urls) {
      const sitePage = await this.openPage();
      this.pageMap.set(url, sitePage);
      await this.attachNetworkListenersToPage(url);
    }

    // start navigation in parallel
    await Promise.all(
      urls.map(async (url) => {
        await this.navigateAndScroll(url);
      })
    );

    //parse cookie data in parallel
    const result = await Promise.all(
      urls.map(async (url) => {
        const responseMap = this.pageResponseMaps.get(url);
        const requestMap = this.pageRequestMaps.get(url);
        const page = this.pageMap.get(url);

        const frameIdUrlMap = this.getPageFrameIdToUrlMap(url);
        // @ts-ignore
        const mainFrameId = this.pageMap.get(url)?.mainFrame()._id;

        if (
          !responseMap ||
          !requestMap ||
          !frameIdUrlMap ||
          !mainFrameId ||
          !page
        ) {
          return {
            pageUrl: url,
            cookieData: {},
          };
        }

        const cookieDataFromNetwork = parseNetworkDataToCookieData(
          responseMap,
          requestMap,
          frameIdUrlMap,
          mainFrameId,
          url
        );

        const networkCookieKeySet = new Set();

        Object.values(cookieDataFromNetwork).forEach(({ frameCookies }) => {
          Object.keys(frameCookies).forEach((key) => {
            networkCookieKeySet.add(key);
          });
        });

        //Get cookies from another API
        const session = await page.createCDPSession();

        const applicationCookies = (await session.send('Page.getCookies'))
          .cookies;

        const filteredApplicationCookies = applicationCookies.filter(
          (cookie) =>
            !networkCookieKeySet.has(
              `${cookie.name}:${cookie.domain}:${cookie.path}`
            )
        );

        const reshapedApplicationCookies = filteredApplicationCookies.reduce<{
          [key: string]: CookieData;
        }>((acc, cookie) => {
          const key = `${cookie.name}:${cookie.domain}:${cookie.path}`;
          acc[key] = {
            parsedCookie: cookie,
            url: '',
          };
          return acc;
        }, {});

        // handles redirection
        const pageUrl = page.url();

        return {
          pageUrl,
          cookieData: {
            ...cookieDataFromNetwork,
            [UNKNOWN_FRAME_KEY]: {
              frameCookies: reshapedApplicationCookies,
              cookiesCount: Object.keys(reshapedApplicationCookies).length,
            },
          },
        };
      })
    );

    return result;
  }

  async deinitialize() {
    await this.browser?.close();
  }
}

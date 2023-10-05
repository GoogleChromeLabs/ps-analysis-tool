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
import puppeteer, { Browser, Page, Protocol } from 'puppeteer';
import { delay } from './utils';
import { parse } from 'simple-cookie';
import { CookieDatabase } from './types';
// import findAnalyticsMatch from './utils/findAnalyticsMatch';
import { getDomain } from 'tldts';

type Cookie = {
  name: string;
  domain: string;
  path: string;
  value: string;
  sameSite: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  isBlocked?: boolean;
};

type ViewportConfig = {
  width: number;
  height: number;
  deviceScaleFactor: number;
};

type ResponseData = {
  frameId: string;
  serverUrl: string;
  cookies: Cookie[];
};

type RequestData = {
  frameId: string;
  serverUrl: string;
  cookies: Cookie[];
};

/**
 *
 * @param responseMap
 * @param requestMap
 * @param frameIdUrlMap
 * @param mainFrameId
 * @param pageUrl
 */
function parseNetworkDataToCookieData(
  responseMap: Map<string, ResponseData>,
  requestMap: Map<string, RequestData>,
  frameIdUrlMap: Map<string, string>,
  mainFrameId: string,
  pageUrl: string
): {
  [frameUrl: string]: {
    cookiesCount: number;
    frameCookies: {
      [key: string]: Cookie;
    };
  };
} {
  const frameIdNetworkDataMap = new Map<
    string,
    { responses: ResponseData[]; requests: RequestData[] }
  >();

  for (const [, response] of responseMap) {
    if (!response.cookies || response.cookies.length === 0) {
      continue;
    }
    const frameId = response.frameId || mainFrameId;
    const prevResposes = frameIdNetworkDataMap.get(frameId)?.responses || [];
    const prevRequests = frameIdNetworkDataMap.get(frameId)?.requests || [];

    frameIdNetworkDataMap.set(frameId, {
      responses: [...prevResposes, response],
      requests: prevRequests,
    });
  }

  for (const [, request] of requestMap) {
    if (!request.cookies || request.cookies.length === 0) {
      continue;
    }
    const frameId = request.frameId || mainFrameId;
    const prevResposes = frameIdNetworkDataMap.get(frameId)?.responses || [];
    const prevRequests = frameIdNetworkDataMap.get(frameId)?.requests || [];

    frameIdNetworkDataMap.set(frameId, {
      responses: prevResposes,
      requests: [...prevRequests, request],
    });
  }

  const frameIdCookiesMap = new Map<
    string,
    {
      frameUrl: string;
      frameCookies: {
        [key: string]: Cookie;
      };
    }
  >();

  for (const [frameId, data] of frameIdNetworkDataMap) {
    const _frameCookies = new Map<string, Cookie>();

    data.requests?.forEach((request: RequestData) => {
      request.cookies.forEach((cookie) => {
        const key = cookie.name + ':' + cookie.domain + ':' + cookie.path;
        _frameCookies.set(key, cookie);
      });
    });

    data.responses?.forEach((response: ResponseData) => {
      response.cookies.forEach((cookie) => {
        // domain update required. Domain based on the server url
        const parsedDomain =
          cookie.domain === '' ? getDomain(response.serverUrl) : cookie.domain;

        const key = cookie.name + ':' + parsedDomain + ':' + cookie.path;
        _frameCookies.set(key, { ...cookie, domain: parsedDomain || '' });
      });
    });

    frameIdCookiesMap.set(frameId, {
      frameUrl: frameIdUrlMap.get(frameId) || pageUrl,
      frameCookies: Object.fromEntries(_frameCookies),
    });
  }
  const frameUrlCookies = new Map<
    string,
    {
      cookiesCount: number;
      frameCookies: {
        [key: string]: Cookie;
      };
    }
  >();

  for (const [, data] of frameIdCookiesMap) {
    const _url = new URL(data.frameUrl);

    const newFrameCookies = {
      ...data.frameCookies,
      ...(frameUrlCookies.get(_url.origin)?.frameCookies || {}),
    };

    frameUrlCookies.set(_url.origin, {
      cookiesCount: Object.keys(newFrameCookies)?.length || 0,
      frameCookies: {
        ...newFrameCookies,
      },
    });
  }

  return Object.fromEntries(frameUrlCookies);
}

class BrowserManagement {
  cookieDictionary: CookieDatabase;
  viewportConfig: ViewportConfig;
  browser: Browser | null;
  isHeadless: boolean;
  pageWaitTime: number;
  pageMap: Map<string, Page>;
  pageResponseMaps: Map<string, Map<string, ResponseData>>;
  pageRequestMaps: Map<string, Map<string, RequestData>>;
  shouldLogDebug: boolean;

  constructor(
    cookieDictionary: CookieDatabase,
    viewportConfig: ViewportConfig,
    isHeadless: boolean,
    pageWaitTime: number,
    shouldLogDebug: boolean
  ) {
    this.cookieDictionary = cookieDictionary;
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

  async initializeBrowser(shouldBlock3pCookies: boolean) {
    this.browser = await puppeteer.launch({
      devtools: true,
      headless: this.isHeadless ? 'new' : false,
    });
    this.debugLog('browser intialized');
    if (shouldBlock3pCookies) {
      await this.blockCookies();
    }
  }

  async blockCookies() {
    if (!this.browser) {
      throw new Error('Browser not intialized');
    }

    const cookiesPage = await this.browser.newPage();
    await cookiesPage.goto('chrome://settings/cookies');

    const radioButton = await cookiesPage.$(
      'settings-ui >>> settings-main >>> settings-basic-page >>> settings-section settings-privacy-page >>> settings-cookies-page >>> #blockThirdParty >>> #label'
    );

    if (radioButton) {
      // @ts-ignore
      await radioButton.evaluate((b) => b.click());
    } else {
      console.log('radio button not found');
    }

    await cookiesPage.close();
    this.debugLog('3p cookies blocked');
  }

  async openPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not intialized');
    }
    const sitePage = await this.browser.newPage();
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
      (response: Protocol.Network.ResponseReceivedExtraInfoEvent) => {
        const cookies = response.headers['set-cookie']
          ?.split('\n')
          .map((headerLine) => {
            const parsedCookie = parse(headerLine);
            return {
              name: parsedCookie.name,
              domain: parsedCookie.domain,
              path: parsedCookie.path || '/',
              value: parsedCookie.value,
              sameSite: parsedCookie.samesite || 'Lax',
              expires: parsedCookie.expires || 'Session',
              httpOnly: parsedCookie.httponly || false,
              secure: parsedCookie.secure || false,
            };
          });
        const prevCookies = responseMap.get(response.requestId)?.cookies || [];
        const mergedCookies = [...prevCookies, ...(cookies || [])];

        responseMap.set(response.requestId, {
          frameId: responseMap.get(response.requestId)?.frameId || '',
          serverUrl: responseMap.get(response.requestId)?.serverUrl || '',
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
      (request: Protocol.Network.RequestWillBeSentExtraInfoEvent) => {
        if (
          request.associatedCookies &&
          request.associatedCookies.length !== 0
        ) {
          const cookies: Protocol.Network.Cookie[] = [];
          request.associatedCookies.forEach(({ blockedReasons, cookie }) => {
            if (blockedReasons.length === 0) {
              cookies.push(cookie);
            }
          });
          requestMap.set(request.requestId, {
            ...(requestMap.get(request.requestId) || {}),
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

    //start navigation in parallel
    await Promise.all(
      urls.map(async (url) => {
        await this.navigateAndScroll(url);
      })
    );

    //parse cookie data in parallel

    return urls.map((url) => {
      const responseMap = this.pageResponseMaps.get(url);
      const requestMap = this.pageRequestMaps.get(url);

      const frameIdUrlMap = this.getPageFrameIdToUrlMap(url);
      // @ts-ignore
      const mainFrameId = this.pageMap.get(url)?.mainFrame()._id;

      if (!requestMap || !responseMap || !frameIdUrlMap || !mainFrameId) {
        return {
          pageUrl: url,
          cookieData: {},
        };
      }
      return {
        pageUrl: url,
        cookieData: parseNetworkDataToCookieData(
          responseMap,
          requestMap,
          frameIdUrlMap,
          mainFrameId,
          url
        ),
      };
    });
  }

  async deinitialize() {
    await this.browser?.close();
  }
}

/**
 *
 * @param urls
 * @param isHeadless
 * @param delayTime
 * @param cookieDictionary
 */
export async function analyzeCookiesUrls(
  urls: string[],
  isHeadless: boolean,
  delayTime: number,
  cookieDictionary: CookieDatabase
) {
  const normalBrowser = new BrowserManagement(
    cookieDictionary,
    {
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    },
    isHeadless,
    delayTime,
    false
  );
  const browserWith3pCookiesBlocked = new BrowserManagement(
    cookieDictionary,
    {
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    },
    isHeadless,
    delayTime,
    false
  );

  await normalBrowser.initializeBrowser(false);
  await browserWith3pCookiesBlocked.initializeBrowser(true);

  const [normalCookieAnaysisData, blockedAnalysisData] = await Promise.all([
    normalBrowser.analyzeCookieUrls(urls),
    browserWith3pCookiesBlocked.analyzeCookieUrls(urls),
  ]);

  await normalBrowser.deinitialize();
  await browserWith3pCookiesBlocked.deinitialize();

  return urls.map((url, ind) => {
    const cookieKeysInBlockedEnv = new Set();
    Object.values(blockedAnalysisData[ind].cookieData).forEach(
      ({ frameCookies }) => {
        Object.keys(frameCookies).forEach((key) => {
          cookieKeysInBlockedEnv.add(key);
        });
      }
    );

    Object.values(normalCookieAnaysisData[ind].cookieData).forEach(
      ({ frameCookies }) => {
        Object.keys(frameCookies).forEach((key) => {
          frameCookies[key].isBlocked = !cookieKeysInBlockedEnv.has(key);
        });
      }
    );

    return normalCookieAnaysisData[ind];
  });
}

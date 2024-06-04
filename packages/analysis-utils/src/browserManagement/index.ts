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
import puppeteer, { Browser, Page, Protocol, Frame } from 'puppeteer';
import { writeFile } from 'fs-extra';
import { parse } from 'simple-cookie';
import { CookieData, UNKNOWN_FRAME_KEY, delay } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { ResponseData, RequestData, ViewportConfig, CookieStoreCookie } from './types';
import { parseNetworkDataToCookieData } from './parseNetworkDataToCookieData';

export class BrowserManagement {
  viewportConfig: ViewportConfig;
  browser: Browser | null;
  isHeadless: boolean;
  pageWaitTime: number;
  pages: Record<string, Page>;
  pageFrames: Record<string, Record<string, string>>;
  pageResponses: Record<string, Record<string, ResponseData>>;
  pageRequests: Record<string, Record<string, RequestData>>;
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
    this.pages = {};
    this.pageFrames = {};
    this.pageResponses = {};
    this.pageRequests = {};
    this.shouldLogDebug = shouldLogDebug;
  }

  debugLog(msg: any) {
    if (this.shouldLogDebug) {
      console.log(msg);
    }
  }

  async initializeBrowser(enable3pCookiePhaseout: boolean) {
    const args: string[] = [];

    if (enable3pCookiePhaseout) {
      args.push('--test-third-party-cookie-phaseout');
    }

    this.browser = await puppeteer.launch({
      devtools: true,
      headless: this.isHeadless,
      args,
    });
    this.debugLog('browser intialized');
  }

  async clickOnAcceptBanner(url: string) {
    const page = this.pages[url];

    if (!page) {
      throw new Error('no page with the provided id was found');
    }

    await page.evaluate(() => {
      const bannerNodes: Element[] = Array.from(
        (document.querySelector('body')?.childNodes || []) as Element[]
      )
        .filter((node: Element) => node && node?.tagName === 'DIV')
        .filter((node) => {
          if (!node || !node?.textContent) {
            return false;
          }
          const regex =
            /\b(consent|policy|cookie policy|privacy policy|personalize|preferences)\b/;

          return regex.test(node.textContent.toLowerCase());
        });

      const buttonToClick: HTMLButtonElement[] = bannerNodes
        .map((node: Element) => {
          const buttonNodes = Array.from(node.getElementsByTagName('button'));
          const isButtonForAccept = buttonNodes.filter(
            (cnode) =>
              cnode.textContent &&
              (cnode.textContent.toLowerCase().includes('accept') ||
                cnode.textContent.toLowerCase().includes('allow') ||
                cnode.textContent.toLowerCase().includes('agree'))
          );

          return isButtonForAccept[0];
        })
        .filter((button) => button);
      buttonToClick[0]?.click();
    });

    await delay(this.pageWaitTime / 2);
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

  async navigateToPage(url: string) {
    const page = this.pages[url];

    if (!page) {
      throw new Error('no page with the provided id was found');
    }

    this.debugLog(`starting navigation to url ${url}`);

    try {
      await page.goto(url, { timeout: 10000 });
      this.debugLog(`done with navigation to url:${url}`);
    } catch (error) {
      this.debugLog(
        `navigation did not finish in 10 seconds moving on to scrolling`
      );
      //ignore
    }
  }

  async pageScroll(url: string) {
    const page = this.pages[url];

    if (!page) {
      throw new Error('no page with the provided id was found');
    }

    try {
      await page.evaluate(() => {
        window.scrollBy(0, 10000);
      });
    } catch (error) {
      this.debugLog(`scrolling the page to the end.`);
      //ignore
    }

    this.debugLog(`scrolling on url:${url}`);
  }

  responseReceivedListener(
    pageId: string,
    { requestId, frameId, response }: Protocol.Network.ResponseReceivedEvent
  ) {
    this.pageResponses[pageId][requestId] = {
      frameId,
      url: response.url,
      cookies: this.pageResponses[pageId][requestId]?.cookies || [],
    };
  }

  responseReceivedExtraInfoListener(
    pageId: string,
    {
      headers,
      cookiePartitionKey,
      blockedCookies,
      requestId,
    }: Protocol.Network.ResponseReceivedExtraInfoEvent
  ) {
    if (!headers['set-cookie']) {
      return;
    }
    const cookies = headers['set-cookie'].split('\n').map((headerLine) => {
      const parsedCookie = parse(headerLine);
      const partitionKey = headerLine.includes('Partitioned')
        ? cookiePartitionKey
        : undefined;

      const blockedEntry = blockedCookies.find((c) => {
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

    const prevCookies = this.pageResponses[pageId][requestId]?.cookies || [];
    const mergedCookies = [...prevCookies, ...(cookies || [])];

    this.pageResponses[pageId][requestId] = {
      frameId: this.pageResponses[pageId][requestId]?.frameId || '',
      serverUrl: this.pageResponses[pageId][requestId]?.url || '',
      // @ts-ignore TODO: fix expires type mismatch
      cookies: mergedCookies,
    };
  }

  requestWillBeSentListener(
    pageId: string,
    { requestId, request, frameId }: Protocol.Network.RequestWillBeSentEvent
  ) {
    this.pageRequests[pageId][requestId] = {
      ...(this.pageRequests[pageId][requestId] || {}),
      frameId,
      url: request.url,
    };
  }

  requestWillBeSentExtraInfoListener(
    pageId: string,
    {
      associatedCookies,
      requestId,
    }: Protocol.Network.RequestWillBeSentExtraInfoEvent
  ) {
    if (!associatedCookies || associatedCookies.length === 0) {
      return;
    }

    const cookies = associatedCookies.map((associatedCookie) => {
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
        url: this.pageRequests[pageId][requestId]?.url || '',
      };
    });

    this.pageRequests[pageId][requestId] = {
      ...(this.pageRequests[pageId][requestId] || {}),
      cookies,
    };
  }

  pageFrameAttachedListener(
    pageId:string,
    { frameId, parentFrameId }: Protocol.Page.FrameAttachedEvent
  ) {
    if (!this.pageFrames[pageId]) {
      this.pageFrames[pageId] = {};
    }

    this.pageFrames[pageId][frameId] = parentFrameId;
  }

  async getMainframeIds() {
    const pageTargetIds: Record<string, string> = {};

    for (const [_url, page] of Object.entries(this.pages)) {
      const cdpSession = await page.createCDPSession();
      const res = await cdpSession.send('Target.getTargets');

      const constructedUrl = page.url();

      const mainFrameTargetId = res.targetInfos.find(
        ({ url, type }) => constructedUrl === url && type == 'page'
      )?.targetId;

      pageTargetIds[_url] = mainFrameTargetId || '';

    }
    return pageTargetIds;
  }

  async attachListenersToPage(pageId: string) {
    const page = this.pages[pageId];

    if (!page) {
      throw new Error(`no page with the provided id was found:${pageId}`);
    }

    const cdpSession = await page.createCDPSession();

    await cdpSession.send('Target.setAutoAttach', {
      // If this is set to true, debugger will be attached to every new target that is added to the current target.
      autoAttach: true,
      waitForDebuggerOnStart: false,
      //Enables "flat" access to the session via specifying sessionId attribute in the commands.
      // If this is set to true the debugger is also attached to the child targets of that the target it has been attached to.
      flatten: true,
    });

    await cdpSession.send('Network.enable');
    await cdpSession.send('Page.enable');

    this.pageRequests[pageId] = {};
    this.pageResponses[pageId] = {};

    cdpSession.on('Network.responseReceived', (ev) =>
      this.responseReceivedListener(pageId, ev)
    );

    cdpSession.on('Network.responseReceivedExtraInfo', (ev) =>
      this.responseReceivedExtraInfoListener(pageId, ev)
    );

    cdpSession.on('Network.requestWillBeSent', (ev) =>
      this.requestWillBeSentListener(pageId, ev)
    );

    cdpSession.on('Network.requestWillBeSentExtraInfo', (ev) =>
      this.requestWillBeSentExtraInfoListener(pageId, ev)
    );

    cdpSession.on('Page.frameAttached', (ev) =>
      this.pageFrameAttachedListener(pageId, ev)
    );

    this.debugLog('done attaching network event listeners');
  }

  async getJSCookies(pageId: string) {
    const page = this.pages[pageId];

    if (!page) {
      throw new Error(`no page with the provided id was found:${pageId}`);
    }

    const frames = page.frames();

    const cookies: CookieStoreCookie[] = [];

    await Promise.all(
      frames.map(async (frame) => {
        if (!frame.url().includes('http')) {
          return;
        }

        const _JSCookies: CookieStoreCookie[] = await frame.evaluate(() => {
          // @ts-ignore
          return cookieStore.getAll();
        });

        cookies.push(..._JSCookies);
      })
    );

    return cookies;
  }

  async analyzeCookies(urls: string[], shouldSkipAcceptBanner: boolean) {
    // Open tabs and attach network listeners
    await Promise.all(
      urls.map(async (url) => {
        const sitePage = await this.openPage();
        this.pages[url] = sitePage;
        await this.attachListenersToPage(url);
      })
    );

    // Navigate to URLs
    await Promise.all(
      urls.map(async (url) => {
        await this.navigateToPage(url);
      })
    );

    // Delay for page to load resources
    await delay(this.pageWaitTime / 2);

    // Accept Banners
    if (shouldSkipAcceptBanner) {
      // delay

      await Promise.all(
        urls.map(async (url) => {
          await this.clickOnAcceptBanner(url);
        })
      );
    }

    // Scroll to bottom of the page
    await Promise.all(
      urls.map(async (url) => {
        await this.pageScroll(url);
      })
    );

    // Delay for page to load more resources
    await delay(this.pageWaitTime / 2);

    const mainframeIds = await this.getMainframeIds();

    Object.entries(mainframeIds).forEach(([_url, id]) => {
      this.pageFrames[_url][id] = '0';
    });

    const result = await Promise.all(
      urls.map(async (url) => {
        const _responses = this.pageResponses[url];
        const _requests = this.pageRequests[url];
        const _page = this.pages[url];

        if (!_responses || !_requests || !_page) {
          return {
            pageUrl: url,
            cookieData: {},
          };
        }

        const cookieDataFromNetwork = await parseNetworkDataToCookieData(
          _responses,
          _requests,
          _page
        );

        const cookieDataFromJS = await this.getJSCookies(url);

        // const cookieData = collateCookieData(
        //   cookieDataFromJS,
        //   cookieDataFromNetwork
        // );

        return {
          // Page may redirect. page.url() gives the redirected URL
          url: _page.url(),
          cookieData: cookieDataFromNetwork,
        };
      })
    );

    return result;
  }

  async deinitialize() {
    await this.browser?.close();
  }
}
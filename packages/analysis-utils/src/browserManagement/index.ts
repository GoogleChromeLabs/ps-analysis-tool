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
import puppeteer, { Browser, HTTPResponse, Page, Protocol } from 'puppeteer';
import { parse, type Cookie } from 'simple-cookie';
import {
  type CookieData,
  type ScriptTagUnderCheck,
  type LibraryData,
  type LibraryMatchers,
  resolveWithTimeout,
  delay,
  RESPONSE_EVENT,
  REQUEST_EVENT,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import {
  ResponseData,
  RequestData,
  ViewportConfig,
  CookieStoreCookie,
  CookieDataFromNetwork,
} from './types';
import { parseNetworkDataToCookieData } from './parseNetworkDataToCookieData';
import collateCookieData from './collateCookieData';

export class BrowserManagement {
  viewportConfig: ViewportConfig;
  browser: Browser | null;
  isHeadless: boolean;
  pageWaitTime: number;
  pages: Record<string, Page>;
  pageFrames: Record<string, Record<string, string>>;
  pageResponses: Record<string, Record<string, ResponseData>>;
  pageRequests: Record<string, Record<string, RequestData>>;
  pageResourcesMaps: Record<string, Record<string, ScriptTagUnderCheck>>;
  shouldLogDebug: boolean;
  spinnies: Spinnies | undefined;
  indent = 0;
  constructor(
    viewportConfig: ViewportConfig,
    isHeadless: boolean,
    pageWaitTime: number,
    shouldLogDebug: boolean,
    indent: number,
    spinnies?: Spinnies
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
    this.pageResourcesMaps = {};
    this.spinnies = spinnies;
    this.indent = indent;
  }

  debugLog(msg: any) {
    if (this.shouldLogDebug && this.spinnies) {
      this.spinnies.add(msg, {
        text: msg,
        //@ts-ignore
        succeedColor: 'white',
        status: 'non-spinnable',
        indent: this.indent,
      });
    }
  }

  async initializeBrowser(enable3pCookiePhaseout: boolean) {
    const args: string[] = [];

    if (enable3pCookiePhaseout) {
      args.push('--test-third-party-cookie-phaseout');
      args.push(
        '--enable-features="FirstPartySets,StorageAccessAPI,StorageAccessAPIForOriginExtension,PageInfoCookiesSubpage,PrivacySandboxFirstPartySetsUI,TpcdMetadataGrants,TpcdSupportSettings,TpcdHeuristicsGrants:TpcdReadHeuristicsGrants/true/TpcdWritePopupCurrentInteractionHeuristicsGrants/30d/TpcdBackfillPopupHeuristicsGrants/30d/TpcdPopupHeuristicEnableForIframeInitiator/all/TpcdWriteRedirectHeuristicGrants/15m/TpcdRedirectHeuristicRequireABAFlow/true/TpcdRedirectHeuristicRequireCurrentInteraction/true"'
      );
    }

    this.browser = await puppeteer.launch({
      devtools: true,
      headless: this.isHeadless,
      args,
    });
    this.debugLog('Browser intialized');
  }

  async clickOnAcceptBanner(url: string) {
    const page = this.pages[url];

    if (!page) {
      throw new Error('No page with the provided id was found');
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
                cnode.textContent.toLowerCase().includes('ok') ||
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

    this.debugLog(`Starting navigation to URL: ${url}`);

    try {
      await page.goto(url, { timeout: 10000 });
      this.debugLog(`Navigation completed to URL: ${url}`);
    } catch (error) {
      this.debugLog(
        `Navigation did not finish in 10 seconds moving on to scrolling`
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
      this.debugLog('Scrolled to end of page');
      //ignore
    }

    this.debugLog(`Scrolling on URL: ${url}`);
  }

  responseEventListener(pageId: string, response: HTTPResponse) {
    if (
      response?.headers()?.['content-type']?.includes('javascript') ||
      response?.headers()?.['content-type']?.includes('html')
    ) {
      response
        .text()
        .then((content) => {
          this.pageResourcesMaps[pageId][response.url()] = {
            origin: response.url(),
            type: response?.headers()?.['content-type']?.includes('javascript')
              ? 'Script'
              : 'Document',
            content,
          };
        })
        .catch(() => undefined);
    }
  }

  responseReceivedListener(
    pageId: string,
    { requestId, frameId, response }: Protocol.Network.ResponseReceivedEvent
  ) {
    if (!this.pageResponses[pageId][requestId]) {
      this.pageResponses[pageId][requestId] = {
        frameId,
        url: response.url,
        cookies: [],
      };
    } else {
      const parsedCookies = this.pageResponses[pageId][requestId]?.cookies.map(
        (cookie) => {
          if (!cookie.url) {
            cookie.url = response.url;
          }

          if (!cookie.parsedCookie.domain) {
            cookie.parsedCookie.domain = new URL(response.url).hostname;
          }
          if (cookie.parsedCookie.domain[0] !== '.') {
            cookie.parsedCookie.domain = '.' + cookie.parsedCookie.domain;
          }
          return cookie;
        }
      );

      this.pageResponses[pageId][requestId]?.cookies.forEach((cookie) => {
        cookie.networkEvents?.responseEvents.map((event) => {
          if (event.requestId === requestId) {
            event.url = response.url;
          }
          return event;
        });
      });

      this.pageResponses[pageId][requestId] = {
        frameId,
        url: response.url,
        cookies: parsedCookies,
      };
    }
  }

  responseReceivedExtraInfoListener(
    pageId: string,
    {
      headers,
      cookiePartitionKey,
      blockedCookies,
      requestId,
      exemptedCookies,
    }: Protocol.Network.ResponseReceivedExtraInfoEvent
  ) {
    const headersToBeParsed = headers['set-cookie'] ?? headers['Set-Cookie'];
    if (!headersToBeParsed) {
      return;
    }

    const cookies: CookieData[] = headersToBeParsed
      .split('\n')
      .map((headerLine) => {
        const parsedCookie: Cookie = parse(headerLine);

        const url = this.pageResponses[pageId][requestId]?.url;

        if (!parsedCookie.domain && url) {
          parsedCookie.domain = new URL(url).hostname;
        }

        if (parsedCookie.domain && parsedCookie.domain[0] !== '.') {
          parsedCookie.domain = '.' + parsedCookie.domain;
        }

        const exemptedEntry = exemptedCookies?.find(({ cookie }) => {
          return cookie?.name === parsedCookie.name;
        });

        const blockedEntry = blockedCookies.find((c) => {
          if (c.cookie) {
            return (
              c.cookie?.name?.trim() === parsedCookie.name?.trim() &&
              c.cookie.domain?.trim() === parsedCookie.domain?.trim() &&
              c.cookie.path?.trim() === parsedCookie.path?.trim()
            );
          } else {
            const temporaryParsedCookie = parse(c.cookieLine);

            return (
              temporaryParsedCookie.name?.trim() ===
                parsedCookie.name?.trim() &&
              temporaryParsedCookie.domain?.trim() ===
                parsedCookie.domain?.trim() &&
              temporaryParsedCookie.path?.trim() === parsedCookie.path?.trim()
            );
          }
        });

        const singleCookie: CookieData = {
          parsedCookie: {
            name: parsedCookie.name,
            domain: parsedCookie.domain,
            path: parsedCookie.path || '/',
            value: parsedCookie.value,
            samesite: parsedCookie.samesite?.toLowerCase() || 'lax',
            expires: parsedCookie.expires || 'Session',
            httponly: parsedCookie.httponly || false,
            secure: parsedCookie.secure || false,
            partitionKey: '',
          },
          networkEvents: {
            responseEvents: [
              {
                type: RESPONSE_EVENT.CDP_RESPONSE_RECEIVED_EXTRA_INFO,
                requestId,
                url,
                blocked: Boolean(blockedEntry),
                timeStamp: Date.now(),
              },
            ],
            requestEvents: [],
          },
          isBlocked: Boolean(blockedEntry),
          blockedReasons: blockedEntry?.blockedReasons,
          exemptionReason: exemptedEntry?.exemptionReason,
          url,
          headerType: 'response',
        };

        if (headerLine.includes('Partitioned')) {
          singleCookie.parsedCookie.partitionKey =
            cookiePartitionKey?.topLevelSite as unknown as string;
        }

        return singleCookie;
      });

    const prevCookies = this.pageResponses[pageId][requestId]?.cookies || [];
    const mergedCookies = [...prevCookies, ...(cookies || [])];

    this.pageResponses[pageId][requestId] = {
      frameId: this.pageResponses[pageId][requestId]?.frameId || '',
      url: this.pageResponses[pageId][requestId]?.url || '',
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

    const cookies = associatedCookies.map<CookieData>((associatedCookie) => {
      const singleCookie = {
        parsedCookie: {
          name: associatedCookie.cookie.name,
          domain: associatedCookie.cookie.domain,
          path: associatedCookie.cookie.path || '/',
          value: associatedCookie.cookie.value,
          samesite: associatedCookie.cookie.sameSite?.toLowerCase() || 'lax',
          expires: associatedCookie.cookie.expires || 'Session',
          httponly: associatedCookie.cookie.httpOnly || false,
          secure: associatedCookie.cookie.secure || false,
          partitionKey: '',
        },
        networkEvents: {
          requestEvents: [
            {
              type: REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO,
              requestId,
              url: this.pageRequests[pageId][requestId]?.url || '',
              blocked: associatedCookie.blockedReasons.length > 0,
              timeStamp: Date.now(),
            },
          ],
          responseEvents: [],
        },
        isBlocked: associatedCookie.blockedReasons.length > 0,
        blockedReasons: associatedCookie.blockedReasons,
        exemptionReason: associatedCookie?.exemptionReason,
        url: this.pageRequests[pageId][requestId]?.url || '',
        headerType: 'request' as CookieData['headerType'],
      };

      if (associatedCookie.cookie?.partitionKey) {
        singleCookie.parsedCookie.partitionKey =
          associatedCookie.cookie?.partitionKey?.topLevelSite;
      }

      return singleCookie;
    });

    this.pageRequests[pageId][requestId] = {
      ...(this.pageRequests[pageId][requestId] || {}),
      cookies,
    };
  }

  pageFrameAttachedListener(
    pageId: string,
    { frameId, parentFrameId }: Protocol.Page.FrameAttachedEvent
  ) {
    if (!this.pageFrames[pageId]) {
      this.pageFrames[pageId] = {};
    }

    this.pageFrames[pageId][frameId] = parentFrameId;
  }

  async getMainframeIds() {
    const pageTargetIds: Record<string, string> = {};

    // This gets targets for all pages.
    const cdpSession = await Object.values(this.pages)[0].createCDPSession();
    const res = await cdpSession.send('Target.getTargets');

    for (const [_url, page] of Object.entries(this.pages)) {
      const constructedUrl = page.url();

      const mainFrameTargetId = res.targetInfos.find(
        ({ url, type }) => constructedUrl === url && type === 'page'
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

    this.debugLog('Attaching network event listeners to page');

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
    this.pageResourcesMaps[pageId] = {};

    page.on('response', (ev) => this.responseEventListener(pageId, ev));

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

    this.debugLog('Finished attaching network event listeners');
  }

  async getJSCookies(page: Page) {
    const frames = page.frames();

    const cookies: CookieDataFromNetwork = {};

    await Promise.all(
      frames.map(async (frame) => {
        try {
          if (!frame.url().includes('http')) {
            return;
          }

          const _JSCookies: CookieStoreCookie[] = await resolveWithTimeout(
            frame.evaluate(() => {
              // @ts-ignore
              return cookieStore?.getAll();
            }),
            [],
            200
          );

          const frameCookies: {
            [key: string]: CookieData;
          } = {};

          _JSCookies.forEach((cookie) => {
            if (!cookie.domain) {
              cookie.domain = new URL(frame.url()).hostname;
            }
            if (cookie.domain[0] !== '.') {
              cookie.domain = '.' + cookie.domain;
            }
            const key = cookie.name + ':' + cookie.domain + ':' + cookie.path;
            frameCookies[key] = {
              parsedCookie: {
                ...cookie,
                partitionKey: '',
                httponly: false,
                samesite: cookie.sameSite?.toLowerCase() || 'lax',
              },
            };
          });

          const frameUrl = new URL(frame.url()).origin;
          cookies[frameUrl] = { frameCookies };
        } catch (error) {
          //Fail silently
        }
      })
    );

    return cookies;
  }

  getResources(urls: string[]) {
    const allFetchedResources: { [key: string]: any } = {};

    urls.forEach((url) => {
      const page = this.pages[url];
      const resources = this.pageResourcesMaps[url];

      if (!page || !resources) {
        allFetchedResources[url] = [];
        return;
      }

      const mainFrameUrl = new URL(page.url()).origin;

      allFetchedResources[mainFrameUrl] = Array.from(
        Object.values(resources) ?? []
      );
    });

    return allFetchedResources;
  }

  async insertAndRunDOMQueryFunctions(
    url: string,
    Libraries: LibraryMatchers[]
  ) {
    const page = this.pages[url];

    if (!page) {
      throw new Error('no page with the provided id was found');
    }

    const domQueryMatches: LibraryData = {};

    await Promise.all(
      Libraries.map(async ({ domQueryFunction, name }) => {
        if (domQueryFunction && name) {
          await page.addScriptTag({
            content: `window.${name.replaceAll('-', '')} = ${domQueryFunction}`,
          });

          const queryResult = await page.evaluate((library: string) => {
            //@ts-ignore
            const functionDOMQuery = window[`${library}`];

            if (!functionDOMQuery) {
              return [];
            }

            return functionDOMQuery();
          }, name.replaceAll('-', ''));

          domQueryMatches[name] = {
            domQuerymatches: queryResult as [string],
          };
        }
      })
    );
    const mainFrameUrl = new URL(page.url()).origin;
    return { [mainFrameUrl]: domQueryMatches };
  }

  async analyzeCookies(
    userProvidedUrls: string[],
    shouldSkipAcceptBanner: boolean,
    Libraries: LibraryMatchers[]
  ) {
    let consolidatedDOMQueryMatches: { [key: string]: LibraryData } = {};
    // Open tabs and attach network listeners
    await Promise.all(
      userProvidedUrls.map(async (url) => {
        const sitePage = await this.openPage();
        this.pages[url] = sitePage;
        await this.attachListenersToPage(url);
      })
    );

    // Navigate to URLs
    await Promise.all(
      userProvidedUrls.map(async (url) => {
        await this.navigateToPage(url);
      })
    );

    // Delay for page to load resources
    await delay(this.pageWaitTime / 2);

    // Accept Banners
    if (!shouldSkipAcceptBanner) {
      // delay

      await Promise.all(
        userProvidedUrls.map(async (url) => {
          await this.clickOnAcceptBanner(url);
        })
      );
    }

    // Scroll to bottom of the page
    await Promise.all(
      userProvidedUrls.map(async (url) => {
        await this.pageScroll(url);
      })
    );

    await Promise.all(
      userProvidedUrls.map(async (url) => {
        const newMatches = await this.insertAndRunDOMQueryFunctions(
          url,
          Libraries
        );

        consolidatedDOMQueryMatches = {
          ...consolidatedDOMQueryMatches,
          ...newMatches,
        };
      })
    );

    // Delay for page to load more resources
    await delay(this.pageWaitTime / 2);

    const mainFrameUrlIdMap = await this.getMainframeIds();

    Object.entries(mainFrameUrlIdMap).forEach(([_url, id]) => {
      if (!this.pageFrames[_url]) {
        this.pageFrames[_url] = {
          [id]: '0',
        };
      } else {
        this.pageFrames[_url][id] = '0';
      }
    });

    const result = await Promise.all(
      userProvidedUrls.map(async (userProvidedUrl) => {
        const _responses = this.pageResponses[userProvidedUrl];
        const _requests = this.pageRequests[userProvidedUrl];
        const _page = this.pages[userProvidedUrl];
        const _pageFrames = this.pageFrames[userProvidedUrl];

        if (!_responses || !_requests || !_page) {
          return {
            url: userProvidedUrl,
            cookieData: {},
          };
        }

        const cookieDataFromNetwork = await parseNetworkDataToCookieData(
          _responses,
          _requests,
          _page,
          _pageFrames
        );

        const cookieDataFromJS = await this.getJSCookies(_page);

        const mainFrameUrl = new URL(_page.url()).origin;

        const collatedCookieData = collateCookieData(
          cookieDataFromNetwork,
          cookieDataFromJS
        );

        return {
          // Page may redirect. page.url() gives the redirected URL
          url: mainFrameUrl,
          cookieData: collatedCookieData,
        };
      })
    );

    return { result, consolidatedDOMQueryMatches };
  }

  async deinitialize() {
    await this.browser?.close();
  }
}

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
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
/**
 * Internal dependencies
 */
import { onTabCreatedListener } from '../tabOnCreatedListener';
import synchnorousCookieStore from '../../../store/synchnorousCookieStore';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import OpenCookieDatabase from 'ps-analysis-tool/assets/data/open-cookie-database.json';
describe('chrome.tabs.onCreated.addListener', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    SinonChrome.tabs.onCreated.addListener(onTabCreatedListener);
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...OpenCookieDatabase,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  describe('Multitab Mode', () => {
    beforeAll(() => {
      synchnorousCookieStore.globalIsUsingCDP = false;
      synchnorousCookieStore.tabMode = 'unlimited';
    });

    test('Openeing new tabs should create an entry for the new tab in synchnorous cookie store.', async () => {
      SinonChrome.tabs.onCreated.dispatch({
        status: 'loading',
        index: 1,
        title: 'CNN News Website',
        url: 'https://edition.cnn.com',
        pinned: false,
        highlighted: false,
        windowId: 11,
        active: true,
        id: 123456,
        audible: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 1,
      });

      await new Promise((r) => setTimeout(r, 2000));

      expect(synchnorousCookieStore.tabs[123456]).toBeTruthy();
    });
  });

  describe('Single Tab Mode', () => {
    beforeEach(() => {
      synchnorousCookieStore.globalIsUsingCDP = false;
      synchnorousCookieStore.tabMode = 'single';
      synchnorousCookieStore.addTabData(123456);
      synchnorousCookieStore.tabToRead = '';
    });
    afterEach(() => {
      synchnorousCookieStore.tabs = {};
      synchnorousCookieStore.tabsData = {};
    });

    test('Openeing new tabs should create an entry for the new tab in synchnorous cookie store.', async () => {
      SinonChrome.tabs.onCreated.dispatch({
        status: 'loading',
        index: 1,
        title: 'CNN News Website',
        url: 'https://edition.cnn.com',
        pinned: false,
        highlighted: false,
        windowId: 11,
        active: true,
        id: 123456,
        audible: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 1,
      });

      await new Promise((r) => setTimeout(r, 2000));

      expect(synchnorousCookieStore.tabs[123456]).toBeTruthy();
    });

    test('Openeing more than 1 tab in single tab processing mode should not create an entry in synchrorous cookie store.', async () => {
      SinonChrome.tabs.onCreated.dispatch({
        status: 'loading',
        index: 1,
        title: 'CNN News Website',
        url: 'https://edition.cnn.com',
        pinned: false,
        highlighted: false,
        windowId: 11,
        active: true,
        id: 123456,
        audible: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 1,
      });

      SinonChrome.tabs.onCreated.dispatch({
        status: 'loading',
        index: 1,
        title: 'CNN News Website',
        url: 'https://edition.cnn.com',
        pinned: false,
        highlighted: false,
        windowId: 11,
        active: true,
        id: 24567,
        audible: false,
        discarded: false,
        autoDiscardable: false,
        groupId: 1,
      });

      await new Promise((r) => setTimeout(r, 2000));

      expect(synchnorousCookieStore.tabs[24567]).not.toBeTruthy();
    });
  });

  test('Openeing new tab and if tabId is missing it should not create new tab.', async () => {
    SinonChrome.tabs.onCreated.dispatch({
      status: 'loading',
      index: 1,
      title: 'CNN News Website',
      url: 'https://edition.cnn.com',
      pinned: false,
      highlighted: false,
      windowId: 11,
      active: true,
      audible: false,
      discarded: false,
      autoDiscardable: false,
      groupId: 1,
    });

    await new Promise((r) => setTimeout(r, 2000));

    expect(Object.keys(synchnorousCookieStore.tabs).length).toBeLessThanOrEqual(
      1
    );
  });
});

// afterEach(() => {
//     synchnorousCookieStore.removeTabData(1141143618);
//   });

//   test('Should parse response Cookies', async () => {
//     SinonChrome.webRequest.onResponseStarted.dispatch({
//       url: 'https://bbc.com',
//       frameId: 0,
//       responseHeaders,
//       tabId: 1141143618,
//       requestId: 457,
//     });

//     await new Promise((r) => setTimeout(r, 2000));

//     expect(
//       Object.keys(synchnorousCookieStore.tabsData[1141143618]).length
//     ).toEqual(24);
//   });

//   test('Should not parse cookies if no cookie header is found in response header', async () => {
//     SinonChrome.webRequest.onResponseStarted.dispatch({
//       url: 'https://bbc.com',
//       frameId: 0,
//       requestHeaders: responseHeaders.filter(
//         ({ name }) => name !== 'set-cookie'
//       ),
//       tabId: 1141143618,
//       requestId: 457,
//     });

//     await new Promise((r) => setTimeout(r, 2000));

//     expect(
//       Object.keys(synchnorousCookieStore.tabsData[1141143618]).length
//     ).toEqual(0);
//   });

//   test('Should not parse cookies if cdp is on', async () => {
//     synchnorousCookieStore.globalIsUsingCDP = true;
//     SinonChrome.webRequest.onResponseStarted.dispatch({
//       url: 'https://bbc.com',
//       frameId: 0,
//       requestHeaders: responseHeaders.filter(
//         ({ name }) => name !== 'set-cookie'
//       ),
//       tabId: 1141143618,
//       requestId: 457,
//     });

//     await new Promise((r) => setTimeout(r, 2000));

//     expect(
//       Object.keys(synchnorousCookieStore.tabsData[1141143618]).length
//     ).toEqual(0);
//     synchnorousCookieStore.globalIsUsingCDP = false;
//   });

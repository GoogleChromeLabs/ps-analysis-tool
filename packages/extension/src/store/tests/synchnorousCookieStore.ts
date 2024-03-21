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
 * Internal dependencies
 */
import SinonChrome from 'sinon-chrome';
import data from '../../utils/test-data/cookieMockData';
import SynchnorousCookieStore from '../synchnorousCookieStore';

let synchnorousCookieStore: SynchnorousCookieStore;
describe('SynchnorousCookieStore:', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    synchnorousCookieStore = new SynchnorousCookieStore();
  });

  beforeEach(() => {
    synchnorousCookieStore.addTabData(123456);
    synchnorousCookieStore.updateUrl(123456, 'https://bbc.com');
  });

  afterEach(() => {
    synchnorousCookieStore.clear();
  });

  it('Should not update storage if there are no new cookies', () => {
    synchnorousCookieStore.update(123456, []);
    expect(Object.keys(synchnorousCookieStore.tabsData[123456]).length).toBe(0);
    expect(synchnorousCookieStore.tabs[123456].newUpdates).toBe(0);
  });

  it('Should add new cookie if cookie doesnt exist', () => {
    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']
    ).toBeUndefined();
    synchnorousCookieStore.update(123456, [data.tabCookies['_cb']]);
    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']
    ).not.toBeUndefined();
    expect(synchnorousCookieStore.tabs[123456].newUpdates).toBe(1);
  });

  it('Should update cookie with new blocked reason', () => {
    synchnorousCookieStore.update(123456, [
      { ...data.tabCookies['_cb'], isBlocked: false, blockedReasons: [] },
    ]);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']?.isBlocked
    ).toBe(false);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']?.blockedReasons
        ?.length
    ).toBe(0);
    expect(synchnorousCookieStore.tabs[123456].newUpdates).toBe(1);

    synchnorousCookieStore.update(123456, [
      {
        ...data.tabCookies['_cb'],
        isBlocked: false,
        blockedReasons: ['InvalidDomain'],
      },
    ]);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']?.isBlocked
    ).toBe(true);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/'].blockedReasons
    ).toContain('InvalidDomain');
    expect(synchnorousCookieStore.tabs[123456].newUpdates).toBe(2);
  });

  it('Should persist the partition key from the previous set data', () => {
    synchnorousCookieStore.update(123456, [
      {
        ...data.tabCookies['_cb'],
        parsedCookie: {
          ...data.tabCookies['_cb'].parsedCookie,
          partitionKey: 'https://bbc.com',
          priority: 'Medium',
        },
      },
    ]);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']?.parsedCookie
        ?.partitionKey
    ).toBe('https://bbc.com');
    expect(synchnorousCookieStore.tabs[123456].newUpdates).toBe(1);

    synchnorousCookieStore.update(123456, [
      {
        ...data.tabCookies['_cb'],
        parsedCookie: {
          ...data.tabCookies['_cb'].parsedCookie,
          partitionKey: undefined,
          priority: 'Medium',
        },
      },
    ]);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']?.parsedCookie
        ?.partitionKey
    ).toBe('https://bbc.com');
    expect(synchnorousCookieStore.tabs[123456].newUpdates).toBe(2);
  });

  it('Should not update the data if tabId is not present', () => {
    synchnorousCookieStore.update(12345, [
      {
        ...data.tabCookies['_cb'],
        parsedCookie: {
          ...data.tabCookies['_cb'].parsedCookie,
          partitionKey: 'https://bbc.com',
          priority: 'Medium',
        },
      },
    ]);
    expect(synchnorousCookieStore.tabs[12345]?.newUpdates).toBeUndefined();
  });

  it('Should clear cookie store when clear is called', () => {
    expect(synchnorousCookieStore.tabs[123456]).toBeDefined();
    expect(synchnorousCookieStore.tabsData[123456]).toBeDefined();

    synchnorousCookieStore.clear();

    expect(synchnorousCookieStore.tabs[123456]).toBeUndefined();
    expect(synchnorousCookieStore.tabsData[123456]).toBeUndefined();
  });

  it('Should return the tab url for tab if exists', () => {
    expect(synchnorousCookieStore.getTabUrl(123456)).toBe('https://bbc.com');
    expect(synchnorousCookieStore.getTabUrl(12345)).toBeNull();
  });

  it('Should update the url of tab if it exists', () => {
    expect(synchnorousCookieStore.getTabUrl(123456)).toBe('https://bbc.com');
    synchnorousCookieStore.updateUrl(123456, 'https://cnn.com');
    expect(synchnorousCookieStore.getTabUrl(123456)).toBe('https://cnn.com');
  });

  it('Should add cookie exclusion reason and warning reason', () => {
    synchnorousCookieStore.addCookieExclusionWarningReason(
      '_cbcnn.com/',
      [],
      ['WarnSameSiteUnspecifiedCrossSiteContext'],
      123456
    );

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/'].warningReasons
    ).toContain('WarnSameSiteUnspecifiedCrossSiteContext');

    synchnorousCookieStore.addCookieExclusionWarningReason(
      '_cbcnn.com/',
      ['ExcludeSameSiteUnspecifiedTreatedAsLax'],
      [],
      123456
    );

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/'].blockedReasons
    ).toContain('ExcludeSameSiteUnspecifiedTreatedAsLax');
  });

  it('Should remove tabData', () => {
    expect(synchnorousCookieStore.tabs[123456]).toBeDefined();
    synchnorousCookieStore.removeTabData(123456);
    expect(synchnorousCookieStore.tabs[123456]).toBeUndefined();
  });

  it('Should remove cookie', () => {
    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']
    ).toBeUndefined();

    synchnorousCookieStore.update(123456, [data.tabCookies['_cb']]);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']
    ).toBeDefined();

    synchnorousCookieStore.removeCookieData(123456);

    expect(
      synchnorousCookieStore.tabsData[123456]['_cbcnn.com/']
    ).toBeUndefined();
  });
});

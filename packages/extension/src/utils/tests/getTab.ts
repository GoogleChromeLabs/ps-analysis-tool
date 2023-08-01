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
import { getTab } from '../getTab';
const dummyTab = {
  active: false,
  audible: false,
  autoDiscardable: true,
  discarded: false,
  favIconUrl: 'file://dummyFolder/picture.png',
  groupId: -1,
  height: 976,
  highlighted: false,
  id: 478098967,
  incognito: false,
  index: 6,
  mutedInfo: {
    muted: false,
  },
  pinned: false,
  selected: false,
  status: 'complete',
  title: 'Test page',
  url: 'file://dummyFolder/index.html',
  width: 1920,
  windowId: 478098000,
};
describe('getTab : ', () => {
  beforeAll(() => {
    //@ts-ignore
    globalThis.chrome = {
      tabs: {
        //@ts-ignore
        get: (tabId: number) => {
          if (tabId === 478098967) {
            return dummyTab;
          } else if (tabId === 478098969) {
            return null;
          }
          throw new Error('Cannot get tab for this id');
        },
      },
      //@ts-ignore
      runtime: {},
    };
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('Should not return tab when tabId is negative', async () => {
    expect(await getTab(-1)).toBe(null);
  });

  it('Should return correct tab when tabId is provided', async () => {
    expect(await getTab(478098967)).toBe(dummyTab);
  });

  it('Should not return tab when correct tabId is not provided', async () => {
    expect(await getTab(478098969)).toBe(null);
  });

  it('Should throw error when incorrect arguments are passed', async () => {
    await getTab(4780989);
    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalled();
  });
});

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
import SinonChrome from 'sinon-chrome';
/**
 * Internal dependencies.
 */
import reloadCurrentTab from '../reloadCurrentTab';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';

describe('reloadCurrentTab : ', () => {
  beforeAll(() => {
    globalThis.chrome = {
      ...(SinonChrome as unknown as typeof chrome),
      //@ts-ignore
      tabs: {
        reload: jest.fn(),
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        query: (_, __) => {
          return [{ id: 40245632, url: 'https://edition.cnn.com' }];
        },
      },
    };

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  it('should be called if tabId is passed', async () => {
    await reloadCurrentTab(123);
    expect(globalThis.chrome.tabs.reload).toHaveBeenCalled();
  });

  it('should be called if tabId is not passed passed', async () => {
    await reloadCurrentTab();
    expect(globalThis.chrome.tabs.reload).toHaveBeenLastCalledWith(40245632, {
      bypassCache: true,
    });
  });
});

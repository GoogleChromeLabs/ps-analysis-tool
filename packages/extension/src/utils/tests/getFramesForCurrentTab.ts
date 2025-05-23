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
import tabFrames, { targetInfo } from '../test-data/tabFrames';
import getFramesForCurrentTab from '../getFramesForCurrentTab';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import RelatedWebsitesSets from 'ps-analysis-tool/data/related_website_sets.json';

describe('getFramesForCurrentTab : ', () => {
  beforeAll(() => {
    //@ts-ignore
    globalThis.chrome = {
      devtools: {
        //@ts-ignore
        inspectedWindow: {
          tabId: 40245632,
        },
      },
      //@ts-ignore
      runtime: {
        getURL: () => 'data/related_website_sets.json',
      },
    };

    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...RelatedWebsitesSets,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  it('Should not return tab when tabId is negative', () => {
    expect(
      getFramesForCurrentTab(
        {},
        tabFrames as chrome.webNavigation.GetAllFrameResultDetails[],
        targetInfo,
        {},
        true
      )
    ).toStrictEqual({
      'https://edition.cnn.com': {
        frameIds: ['SADASQ5546SDT45673', '0'],
        frameType: 'outermost_frame',
      },
      'https://crxd.net': {
        frameIds: [
          'ASFGHSD2453465645568679FR',
          'ADFSDGRW4365663SDGF',
          '2',
          '3',
        ],
        frameType: 'sub_frame',
      },
    });
  });
});

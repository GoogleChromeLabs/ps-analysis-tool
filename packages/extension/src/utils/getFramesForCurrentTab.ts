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
import { type TabFrames } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import { isOnRWS } from '../contentScript/utils';

/**
 * This function returns tab frames state for frame ids and frame URLs along with rws information from using chrome.webNavigation.getAllFrames.
 * @returns {TabFrames|null} Tabframes and related details if available else null.
 */
export default async function getFramesForCurrentTab() {
  const tabId = chrome.devtools.inspectedWindow.tabId;
  if (!tabId) {
    return null;
  }

  const regexForFrameUrl =
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;

  const currentTabFrames = await chrome.webNavigation.getAllFrames({
    tabId,
  });
  const modifiedTabFrames: TabFrames = {};

  currentTabFrames?.forEach(({ url, frameId, frameType }) => {
    if (url && url.includes('http')) {
      const parsedUrl = regexForFrameUrl.exec(url);
      if (parsedUrl && parsedUrl[0]) {
        if (modifiedTabFrames[parsedUrl[0]]) {
          modifiedTabFrames[parsedUrl[0]].frameIds.push(frameId);
        } else {
          modifiedTabFrames[parsedUrl[0]] = {
            frameIds: [frameId],
            frameType,
          };
        }
      }
    }
  });
  await Promise.all(
    Object.keys(modifiedTabFrames).map(async (tabFrame) => {
      modifiedTabFrames[tabFrame].isOnRWS = await isOnRWS(tabFrame);
      return tabFrame;
    })
  );

  return modifiedTabFrames;
}

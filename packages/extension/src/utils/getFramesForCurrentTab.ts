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
 * This function returns tab frames state for frame ids and frame URLs along with rws information from using chrome.webNavigation.getAllFrames.
 * @param prevState Previous state to which data will be appended.
 * @param currentTabFrames Current frames in the tab.
 * @param currentTargets Current debugger targets in the browser.
 * @param extraFrameData Extra frames data that has been provided by the serivce worker.
 * @param isUsingCDP Determines if cdp is being used.
 * @returns {TabFrames|null} Tabframes and related details if available else null.
 */
export default function getFramesForCurrentTab(
  prevState: TabFrames | null,
  currentTabFrames: chrome.webNavigation.GetAllFrameResultDetails[] | null,
  currentTargets: chrome.debugger.TargetInfo[],
  extraFrameData: Record<string, string[]>,
  isUsingCDP: boolean
) {
  const modifiedTabFrames: TabFrames = isUsingCDP ? {} : prevState ?? {};

  currentTabFrames?.forEach(({ url, frameType, frameId }) => {
    if (url && url.includes('http')) {
      const parsedUrl = new URL(url).origin;
      if (!parsedUrl) {
        return;
      }

      const frameIdsFromCDP: string[] = [];

      currentTargets.forEach(({ url: targetUrl, type, id }) => {
        if (url === targetUrl && (type === 'page' || type === 'other')) {
          frameIdsFromCDP.push(id);
        }
      });

      const currentFrameIds = isUsingCDP
        ? frameIdsFromCDP
        : [frameId.toString()];

      if (frameIdsFromCDP.length) {
        if (modifiedTabFrames[parsedUrl]) {
          modifiedTabFrames[parsedUrl].frameIds = Array.from(
            new Set([
              ...(modifiedTabFrames[parsedUrl].frameIds ?? []),
              ...(prevState?.[parsedUrl]?.frameIds ?? []),
              ...(currentFrameIds ?? []),
            ])
          );
        } else {
          modifiedTabFrames[parsedUrl] = {
            frameIds: Array.from(
              new Set([
                ...(currentFrameIds ?? []),
                ...(prevState?.[parsedUrl]?.frameIds ?? []),
              ])
            ),
            frameType,
          };
        }
      }
    }
  });

  if (isUsingCDP) {
    Object.keys(extraFrameData).forEach((key) => {
      if (key === 'null') {
        return;
      }

      if (modifiedTabFrames[key]) {
        modifiedTabFrames[key].frameIds = Array.from(
          new Set([
            ...(modifiedTabFrames[key].frameIds ?? []),
            ...(extraFrameData[key] ?? []),
          ])
        );
      } else {
        modifiedTabFrames[key] = {
          frameIds: extraFrameData[key] ?? [],
          frameType: 'sub_frame',
        };
      }
    });
  }

  return modifiedTabFrames;
}

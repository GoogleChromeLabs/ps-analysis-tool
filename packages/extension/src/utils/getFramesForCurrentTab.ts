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
 * @returns {TabFrames|null} Tabframes and related details if available else null.
 */
export default function getFramesForCurrentTab(
  prevState: TabFrames | null,
  currentTabFrames: chrome.webNavigation.GetAllFrameResultDetails[] | null,
  currentTargets: chrome.debugger.TargetInfo[]
) {
  const regexForFrameUrl =
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;

  const modifiedTabFrames: TabFrames = {};

  currentTabFrames?.forEach(({ url, frameType }) => {
    if (url && url.includes('http')) {
      const parsedUrl = regexForFrameUrl.exec(url);
      if (!parsedUrl || !parsedUrl[0]) {
        return;
      }

      const frameIdsFromCDP = currentTargets.map(
        ({ url: targetUrl, type, id }) => {
          if (
            targetUrl.includes(parsedUrl[0]) &&
            (type === 'page' || type === 'other')
          ) {
            return id;
          }
          return '';
        }
      );

      if (frameIdsFromCDP.length) {
        if (modifiedTabFrames[parsedUrl[0]]) {
          modifiedTabFrames[parsedUrl[0]].frameIds = Array.from(
            new Set([
              ...(modifiedTabFrames[parsedUrl[0]].frameIds ?? []),
              ...(prevState?.[parsedUrl[0]]?.frameIds ?? []),
              ...(frameIdsFromCDP ?? []),
            ])
          );
        } else {
          modifiedTabFrames[parsedUrl[0]] = {
            frameIds: Array.from(
              new Set([
                ...(frameIdsFromCDP ?? []),
                ...(prevState?.[parsedUrl[0]]?.frameIds ?? []),
              ])
            ),
            frameType,
          };
        }
      }
    }
  });

  return {
    ...prevState,
    ...modifiedTabFrames,
  };
}

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
import { TabCookies } from '../cookies.types';
interface TabFrames {
  [key: string]: { frameIds: number[] };
}

const filterCookiesByFrame = (
  cookies: TabCookies | null,
  tabFrames: TabFrames | null,
  frameUrl: string | null
) => {
  const frameFilteredCookies: TabCookies = {};
  if (!cookies || !frameUrl || !tabFrames || !tabFrames[frameUrl]) {
    return Object.values(frameFilteredCookies);
  }

  let tabFramesIDMap: number[] = [];

  Object.keys(tabFrames)?.forEach((url) => {
    const frameIds = tabFrames[url].frameIds;

    if (frameIds) {
      tabFramesIDMap = [...new Set<number>([...frameIds, ...tabFramesIDMap])];
    }
  });

  Object.entries(cookies).forEach(([key, cookie]) => {
    tabFrames[frameUrl].frameIds?.forEach((frameId) => {
      if (cookie.frameIdList?.includes(frameId)) {
        frameFilteredCookies[key] = cookie;
      }

      //For orphaned/unmapped cookies
      let hasFrame = false;
      cookie.frameIdList?.forEach((cookieFrameId) => {
        if (tabFramesIDMap.includes(cookieFrameId as number)) {
          hasFrame = true;
        }
      });

      if (!hasFrame && cookie?.frameIdList) {
        //For UnMapped Cookies
        if (
          cookie.frameIdList &&
          cookie.frameIdList.length === 0 &&
          cookie.parsedCookie.domain
        ) {
          const domainToCheck = cookie.parsedCookie.domain.startsWith('.')
            ? cookie.parsedCookie.domain.slice(1)
            : cookie.parsedCookie.domain;

          if (frameUrl.includes(domainToCheck)) {
            frameFilteredCookies[key] = cookie;
          }
          if (
            Object.keys(tabFrames).filter((frameKey) =>
              frameKey.includes(domainToCheck)
            ).length === 0 &&
            tabFrames[frameUrl].frameIds.includes(0)
          ) {
            frameFilteredCookies[key] = cookie;
          }
        }

        //For Orphaned Cookies
        if (
          cookie.frameIdList &&
          cookie.frameIdList.length > 0 &&
          cookie.parsedCookie.domain
        ) {
          if (tabFrames[frameUrl].frameIds.includes(0)) {
            frameFilteredCookies[key] = cookie;
          }
        }
      }
    });
  });

  return Object.values(frameFilteredCookies);
};

export default filterCookiesByFrame;

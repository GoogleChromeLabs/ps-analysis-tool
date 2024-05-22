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
  [key: string]: { frameIds: string[] };
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

  Object.entries(cookies).forEach(([key, cookie]) => {
    tabFrames[frameUrl].frameIds?.forEach((frameId) => {
      if (frameId && cookie.frameIdList?.includes(frameId)) {
        frameFilteredCookies[key] = cookie;
      }
    });
  });

  return Object.values(frameFilteredCookies);
};

export default filterCookiesByFrame;

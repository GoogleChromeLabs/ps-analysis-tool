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
import { CookieTableData } from '../cookies.types';

interface Cookies {
  [key: string]: CookieTableData;
}

interface TabFrames {
  [key: string]: { frameIds: number[] };
}

const filterCookiesByFrame = (
  cookies: Cookies | null,
  tabFrames: TabFrames | null,
  frameUrl: string | null
) => {
  const frameFilteredCookies: { [key: string]: CookieTableData } = {};

  if (cookies && frameUrl && tabFrames && tabFrames[frameUrl]) {
    Object.entries(cookies).forEach(([key, cookie]) => {
      tabFrames[frameUrl].frameIds?.forEach((frameId) => {
        if (cookie.frameIdList?.includes(frameId)) {
          frameFilteredCookies[key] = cookie;
        }
      });
    });
  }

  return Object.values(frameFilteredCookies);
};

export default filterCookiesByFrame;

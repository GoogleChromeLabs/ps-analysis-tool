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
import type { CookieFrameStorageType, CookieJsonDataType } from '../../types';

const extractCookies = (
  cookieData: {
    frameCookies: CookieFrameStorageType;
  },
  pageUrl: string,
  shouldAddUrlToKey = false
) => {
  return Object.entries(cookieData).reduce(
    (acc: CookieFrameStorageType, [frame, _data]) => {
      acc[frame] = Object.fromEntries(
        Object.entries(_data.frameCookies).map(([key, cookie]) => [
          key + (shouldAddUrlToKey ? '' : pageUrl),
          {
            ...cookie,
            pageUrl,
            frameUrl: frame,
          } as CookieJsonDataType,
        ])
      );

      return acc;
    },
    {}
  );
};

export default extractCookies;

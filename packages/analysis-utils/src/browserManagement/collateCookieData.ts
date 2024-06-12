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
import { CookieDataFromNetwork } from './types';

/**
 *
 * @param cookieDataFromNetwork
 * @param cookieDataFromJS
 * @returns cookieDataFromNetwork
 */
export default function collateCookieData(
  cookieDataFromNetwork: CookieDataFromNetwork,
  cookieDataFromJS: CookieDataFromNetwork
): CookieDataFromNetwork {
  Object.entries(cookieDataFromJS).forEach(([frameUrl, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([key, cookie]) => {
      if (!cookieDataFromNetwork[frameUrl]) {
        cookieDataFromNetwork[frameUrl] = {
          frameCookies: {
            [key]: {
              parsedCookie: cookie.parsedCookie,
              headerType: 'javascript',
            },
          },
        };
      }

      if (!cookieDataFromNetwork[frameUrl].frameCookies[key]) {
        cookieDataFromNetwork[frameUrl].frameCookies[key] = {
          parsedCookie: cookie.parsedCookie,
          headerType: 'javascript',
        };
      }
    });
  });
  return cookieDataFromNetwork;
}

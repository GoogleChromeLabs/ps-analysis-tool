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
 * Collate network and JS cookie data.
 * @param cookieDataFromNetwork Cookie data from network.
 * @param cookieDataFromJS cookie data from JS.
 * @returns cookieDataFromNetwork Cookie data from network and JS if it exits.
 */
export default function collateCookieData(
  cookieDataFromNetwork: CookieDataFromNetwork,
  cookieDataFromJS: CookieDataFromNetwork
): CookieDataFromNetwork {
  Object.entries(cookieDataFromJS).forEach(([frameUrl, { frameCookies }]) => {
    Object.entries(frameCookies).forEach(([key, cookie]) => {
      // Check if the frame's data exists.  if not create frame data object
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
      // Check if the cookie's data exists. if not add cookie data object to frame cookies. Otherwise cookie data from network stream will be used.
      else if (!cookieDataFromNetwork[frameUrl].frameCookies[key]) {
        cookieDataFromNetwork[frameUrl].frameCookies[key] = {
          parsedCookie: cookie.parsedCookie,
          headerType: 'javascript',
        };
      }
    });
  });

  return cookieDataFromNetwork;
}

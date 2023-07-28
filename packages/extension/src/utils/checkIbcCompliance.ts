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
 * Check if cookie is compliant with IBC(Incrementally Better Cookies) proposal.
 * @param samesite Cookie SameSite attribute
 * @param secure Cookie secure attribute
 * @param name Cookie name
 * @param url Cookie url
 * @returns {boolean} True if cookie is compliant with IBC proposal.
 */
export async function checkIbcCompliance(
  samesite = 'lax',
  secure = false,
  name: string,
  url: string
): Promise<boolean> {
  const chromeCookieStoreHasCookie = Boolean(
    await chrome.cookies.get({
      name: name,
      url: url,
    })
  );

  if (samesite.toLowerCase() === 'none') {
    return secure ? chromeCookieStoreHasCookie : !chromeCookieStoreHasCookie;
  }

  return chromeCookieStoreHasCookie;
}

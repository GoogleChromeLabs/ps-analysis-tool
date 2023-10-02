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
import { CookieLogDetails } from '../types';
import BrowserManagement, {
  BrowserManagementOptions,
} from '../utils/browserManagement';
import Utility from '../utils/utility';
import CookiesManagement from '../utils/cookiesManagement';

/**
 * Procedure to analyze the cookies from give list of urls.
 * @param {Array}  urls List of URLs.
 * @param {object} browserArgs Browser Arguments.
 * @returns {object} List of cookies.
 */
export async function analyzeCookiesUrls(
  urls: Array<string>,
  browserArgs: BrowserManagementOptions
): Promise<Array<CookieLogDetails>> {
  const browserManagement: BrowserManagement = new BrowserManagement();
  await browserManagement.initialize(browserArgs);
  browserManagement.createMultiple(urls);

  await browserManagement.run();
  await browserManagement.deinitialize();

  let allCookies: Array<CookieLogDetails> = Utility.listPluck(
    browserManagement.getJobs(),
    'response'
  );

  // @ts-ignore
  allCookies = Utility.mergeAll(allCookies);
  allCookies = CookiesManagement.getUnique(allCookies);

  return allCookies;
}

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

import { BrowserManagement } from '../browserManagement';
import { writeFile } from 'fs-extra';

/**
 * Internal dependencies.
 */

export const testProcedure = async () => {
  // Create browser instance
  const browser = new BrowserManagement(
    {
      width: 1440,
      height: 790,
      deviceScaleFactor: 1,
    },
    true,
    10000,
    false
  );

  //Init browser
  await browser.initializeBrowser(true);

  const cookies = await browser.analyzeCookies(
    ['https://edition.cnn.com', 'https://bbc.com', 'https://livemint.com'],
    false
  );

  await writeFile('data.json', JSON.stringify(cookies, null, 4));

  await browser.deinitialize();
};

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
 * External dependencies.
 */
import dotenv from 'dotenv';
import { Page, Frame } from 'puppeteer';

/**
 * Internal dependencies.
 */
import { PuppeteerManagement } from '../../test-utils/puppeteerManagement';
import { Interaction } from '../../test-utils/interaction';
import { selectors } from '../../test-utils/constants';

dotenv.config();

describe('Validate the Cookies search', () => {
  let page: Page;
  let puppeteer: PuppeteerManagement;
  let interaction: Interaction;

  beforeEach(async () => {
    puppeteer = new PuppeteerManagement();
    await puppeteer.setup();
    page = await puppeteer.openPage();
  }, 40000);

  afterEach(async () => {
    await puppeteer.close();
  }, 40000);

  test('Should be able to search the cookie', async () => {
    await puppeteer.navigateToURL(page, 'https://bbc.com');

    const devtools = await puppeteer.getDevtools();
    const key = puppeteer.getCMDKey();
    interaction = new Interaction(devtools, key);

    const frame: Frame | null =
      await interaction.navigateToCurrentURLCookieFrame(
        page.url().replace(/\/$/, '')
      );

    if (frame) {
      await frame.waitForSelector(selectors.tableRowsSelector, {
        timeout: 10000,
      });

      const cookieNames = await interaction.getCookieNames(frame);
      await interaction.delay(2000);

      if (cookieNames.length > 0) {
        const searchQuery = cookieNames[cookieNames.length - 3];
        await frame.type(selectors.searchFieldCookietab, searchQuery);

        await interaction.delay(3000);

        const matchingResults = await interaction.getCookieNames(frame);
        await interaction.delay(3000);

        const isSearchSuccessful = matchingResults.some((result: string) =>
          result ? result.includes(searchQuery) : false
        );
        await interaction.delay(2000);

        expect(isSearchSuccessful).toBe(true);
      } else {
        throw new Error('No cookies found to search.');
      }
    } else {
      throw new Error('Failed to navigate to the cookie frame.');
    }
  }, 60000);
});

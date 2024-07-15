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

dotenv.config();

describe('Validate the Cookies filter option', () => {
  let page: Page;
  let puppeteer: PuppeteerManagement;
  let interaction: Interaction;

  beforeEach(async () => {
    puppeteer = new PuppeteerManagement();
    await puppeteer.setup();
    page = await puppeteer.openPage();
  });

  afterEach(async () => {
    await puppeteer.close();
  });

  test('Should be able to validate the cookie filters', async () => {
    await puppeteer.navigateToURL(page, 'https://bbc.com');

    const devtools = await puppeteer.getDevtools();
    const key = puppeteer.getCMDKey();
    interaction = new Interaction(devtools, key);

    // Navigate to the current site cookie frame URL.
    const frame: Frame | null =
      await interaction.navigateToCurrentURLCookieFrame(
        page.url().replace(/\/$/, '')
      );
    await interaction.delay(2000);

    if (!frame) {
      throw new Error('Failed to navigate to cookie frame.');
    }

    await interaction.openFilter(frame);
    await interaction.openFilterOption(frame, 'Category');
    await interaction.clickOnFilterOption(frame, 'Analytics');
    await interaction.clickOnFilterOption(frame, 'Uncategorized');
    await interaction.clickOnFilterOption(frame, 'Clear all');

    // Assert that the clearAll button is not visible
    const isNotVisible = (await frame.$('div.false')) === null;
    expect(isNotVisible).toBe(true);
  }, 30000);
});

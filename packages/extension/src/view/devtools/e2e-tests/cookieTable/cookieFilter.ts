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
jest.retryTimes(3);
describe.skip('Validate the Cookies filter option', () => {
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

  test('Should be able to validate the cookie filters', async () => {
    await puppeteer.navigateToURL(page, 'https://bbc.com?psat_cdp=on');
    page.reload();

    const devtools = await puppeteer.getDevtools();
    const key = puppeteer.getCMDKey();
    interaction = new Interaction(devtools, key);

    // Navigate to the current site cookie frame URL.
    const frame: Frame | null =
      await interaction.navigateToCurrentURLCookieFrame(
        'https://www.bbc.com/'.replace(/\/$/, '')
      );

    await interaction.delay(2000);

    if (!frame) {
      throw new Error('Failed to navigate to cookie frame.');
    }

    await interaction.openFilter(frame);
    await interaction.openFilterOption(frame, 'Category');
    await interaction.clickOnFilterOption(frame, 'Analytics');

    // Validate if the Analytics is selected or not in the filter.
    const elementSelector =
      '.block.whitespace-nowrap.text-onyx.dark\\:text-manatee';

    // Wait for the element to be visible
    await frame.waitForSelector(elementSelector, { visible: true });

    // Extract the text content of the element
    const actualText = await frame.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? element.textContent?.trim() : ''; // Non-null assertion
    }, elementSelector);

    expect(actualText).toBe('Category: Analytics');
  }, 60000);
});

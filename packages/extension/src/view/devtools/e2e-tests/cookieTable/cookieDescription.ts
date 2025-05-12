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
import { setTimeout } from 'node:timers/promises';

/**
 * Internal dependencies.
 */
import { PuppeteerManagement } from '../../test-utils/puppeteerManagement';
import { Interaction } from '../../test-utils/interaction';
import { selectors } from '../../test-utils/constants';

dotenv.config();
jest.retryTimes(3);
describe.skip('Validate the Cookies description', () => {
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

  test('Should be able to view the cookie description', async () => {
    await puppeteer.navigateToURL(page, 'https://bbc.com?psat_cdp=on');
    page.reload();

    const devtools = await puppeteer.getDevtools();
    const key = puppeteer.getCMDKey();
    interaction = new Interaction(devtools, key);

    const frame: Frame | null =
      await interaction.navigateToCurrentURLCookieFrame(
        'https://www.bbc.com/'.replace(/\/$/, '')
      );

    if (frame) {
      await setTimeout(2000);

      const rowElement = await frame.$('div[data-testid="body-row"]');

      // Click on the row element
      if (rowElement) {
        await rowElement.click();
      }
      await setTimeout(2000);

      // Assert if description is visible.
      const isVisible = await interaction.isElementVisible(
        frame,
        selectors.descriptionBoxSelector
      );
      expect(isVisible).toBe(true);
    } else {
      throw new Error('Failed to navigate to the cookie frame.');
    }
  }, 60000);
});

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
import { Page } from 'puppeteer';

/**
 * Internal dependencies.
 */
import { PuppeteerManagement } from '../../test-utils/puppeteerManagement';
import { Interaction } from '../../test-utils/interaction';
import { selectors } from '../../test-utils/constants';

dotenv.config();

describe('RWS membership', () => {
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

  test('Should be able to validate the RWS membership', async () => {
    await puppeteer.navigateToURL(page, 'https://www.hindustantimes.com/');

    const devtools = await puppeteer.getDevtools();
    const key = puppeteer.getCMDKey();
    interaction = new Interaction(devtools, key);

    const frame = await interaction.navigateToCookieTab();

    if (!frame) {
      return;
    }

    const openSiteBoundariesTab = async () => {
      const dropdown = await frame.waitForSelector(
        selectors.siteBoundariesSelector,
        {
          timeout: 10000,
        }
      );
      await dropdown?.click();
    };

    await openSiteBoundariesTab();

    // Check if RWS is present and click on it.
    await interaction.clickMatchingElement(frame, 'p', 'Related Website Sets');
    await interaction.clickMatchingElement(frame, 'button', 'Membership');
    await interaction.delay(6000);

    const rwsmembershiptext = await interaction.getInnerText(
      frame,
      'p.text-lg.font-medium'
    );
    expect(rwsmembershiptext).toBe(
      '✓ This site belongs to a Related Website Set.'
    );
  }, 1200000);
});

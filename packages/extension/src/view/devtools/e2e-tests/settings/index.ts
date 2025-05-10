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
import { Page } from 'puppeteer';

/**
 * Internal dependencies.
 */
import { PuppeteerManagement } from '../../test-utils/puppeteerManagement';
import { Interaction } from '../../test-utils/interaction';
import { selectors } from '../../test-utils/constants';
jest.retryTimes(3, { logErrorsBeforeRetry: true });
describe('Settings Page', () => {
  describe('CDP', () => {
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

    test('Should be able to validate the CDP setting option', async () => {
      await puppeteer.navigateToURL(page, 'https://bbc.com?psat_cdp=on');
      page.reload();

      const devtools = await puppeteer.getDevtools();
      const key = puppeteer.getCMDKey();
      interaction = new Interaction(devtools, key);

      // Navigate to Settings Page
      const devtoolsTargets = await interaction.navigateToSettingsTab();

      // Switch to the iframe of devtool
      const iframe = await devtoolsTargets.$(selectors.devtoolIframeSelector);
      const frame = await iframe?.contentFrame();
      await interaction.delay(2000);

      if (!frame) {
        throw new Error('Content frame not found');
      }

      // click on enable CDP button
      await frame.evaluate(() => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"][name="autoSaver"]'
        );
        checkboxes[0].click();
      });
      await interaction.delay(2000);
      await frame.waitForSelector('button[data-test-id="button"]');
      await frame.click('button[data-test-id="button"]');
      await interaction.delay(3000);

      await frame.waitForSelector('button[title="Site Boundaries"]', {
        timeout: 5000,
      });
      const siteBoundariesOpener = await frame.$(
        'button[title="Site Boundaries"]'
      );

      await siteBoundariesOpener?.click();

      const elementTextToClick = 'Cookies';
      await interaction.clickMatchingElement(frame, 'p', elementTextToClick);

      await interaction.delay(3000);

      await interaction.delay(3000);

      // Assert if Blocked cookies description is visible on cookie landing page.
      const isVisible = await interaction.isElementVisible(
        frame,
        'div[data-testid="blocked-cookies-insights"]'
      );
      expect(isVisible).toBe(true);

      // Click on the blocked cookies count and validate it should render the first frame with blocked reason selected.
      const blockCookiesElements = await frame.$$('.VictoryContainer');
      if (blockCookiesElements.length >= 4) {
        await blockCookiesElements[3].click();
      }
    }, 60000);
  });
});

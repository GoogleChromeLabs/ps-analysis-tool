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
import { Page, Target, Browser } from 'puppeteer';

/**
 * Internal dependencies.
 */
import { PuppeteerManagement } from '../../test-utils/puppeteerManagement';
import { Interaction } from '../../test-utils/interaction';
import { selectors } from '../../test-utils/constants';
jest.retryTimes(3);
describe('Settings Page', () => {
  describe('Multi-tab debugging', () => {
    let page: Page;
    let puppeteer: PuppeteerManagement;
    let browser: Browser;

    beforeEach(async () => {
      puppeteer = new PuppeteerManagement();
      await puppeteer.setup(['--no-sandbox', '--disable-setuid-sandbox']);
      page = await puppeteer.openPage();
      browser = page.browser();
    }, 40000);

    afterEach(async () => {
      await puppeteer.close();
    }, 40000);

    test('Should be able to validate the multitab setting option', async () => {
      await page.goto('https://bbc.com');

      const devtools = await puppeteer.getDevtools();
      const key = puppeteer.getCMDKey();
      const interaction = new Interaction(devtools, key);

      // Navigate to Settings Page
      const devtoolsTargets = await interaction.navigateToSettingsTab();

      // Switch to the iframe of devtool
      const iframe = await devtoolsTargets.$(selectors.devtoolIframeSelector);

      if (!iframe) {
        throw new Error('DevTools iframe not found');
      }

      const frame = await iframe.contentFrame();

      if (!frame) {
        throw new Error('Content frame not found');
      }
      await interaction.delay(2000);

      // click on enable multitab debugging button
      await frame.evaluate(() => {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"][name="autoSaver"]'
        );
        checkboxes[1].click();
      });

      // Click on reload all tabs button
      await frame.click('button[data-test-id="button"]');

      // Open a new page
      const newPage = await browser.newPage();
      await newPage.goto('https://bbc.com');

      // Find the DevTools target for the new page
      const targets = browser.targets();
      const devToolsTarget = targets.find(
        (target: Target) =>
          target.type() === 'other' && target.url().startsWith('devtools://')
      );

      if (!devToolsTarget) {
        throw new Error('DevTools target not found for the new page');
      }

      await interaction.delay(3000);

      // Get the page associated with the DevTools target
      const devToolsPage = await devToolsTarget.page();

      if (!devToolsPage) {
        throw new Error('DevTools page not found.');
      }

      await devToolsPage.bringToFront();

      // Switch to the iframe of devtool
      const iframes = await devToolsPage.$(selectors.devtoolIframeSelector);
      const frame2 = await iframes?.contentFrame();

      if (!frame2) {
        throw new Error('Content frame not found');
      }

      await interaction.delay(2000);

      // Click on the cookies from the menu,
      const elementTextToClick = 'Cookies';
      await interaction.clickMatchingElement(frame2, 'p', elementTextToClick);

      // Assert if Blocked cookies description is visible on cookie landing page.
      const isVisible = await interaction.isElementVisible(
        frame2,
        selectors.analyzeThisButtonSelector
      );
      expect(isVisible).toBe(false);
    }, 60000);
  });

  describe('CDP', () => {
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

    test('Should be able to validate the CDP setting option', async () => {
      await puppeteer.navigateToURL(page, 'https://bbc.com');

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
      await frame.click('input[type="checkbox"][name="autoSaver"]');
      await interaction.delay(2000);

      await frame.click('button[data-test-id="button"]');
      await interaction.delay(3000);

      const elementTextToClick = 'Cookies';
      await interaction.clickMatchingElement(frame, 'p', elementTextToClick);

      await interaction.delay(3000);

      // Click on the Analyze the tab button.
      await frame.waitForSelector(selectors.analyzeThisButtonSelector, {
        timeout: 5000,
      });
      const button = await frame.$(selectors.analyzeThisButtonSelector);
      await button?.click();

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

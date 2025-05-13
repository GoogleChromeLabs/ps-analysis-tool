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
jest.retryTimes(3);
dotenv.config();
describe('Validate the Known Breakages, GSI and GIS', () => {
  let page: Page;
  let puppeteer: PuppeteerManagement;
  let interaction: Interaction;

  describe('GSI, GIS', () => {
    beforeEach(async () => {
      puppeteer = new PuppeteerManagement();
      await puppeteer.setup();
      page = await puppeteer.openPage();
    }, 40000);

    afterEach(async () => {
      await puppeteer.close();
    }, 40000);

    test('Should be able to validate the Known Breakages, GSI and GIS', async () => {
      await puppeteer.navigateToURL(
        page,
        'https://in.linkedin.com/?psat_cdp=on'
      );
      page.reload();
      const devtools = await puppeteer.getDevtools();
      const key = puppeteer.getCMDKey();
      interaction = new Interaction(devtools, key);

      // Navigate to the cookie tab
      const frame = await interaction.navigateToCookieTab();

      if (!frame) {
        throw new Error('Content frame not found');
      }

      await interaction.delay(8000);
      await frame.waitForSelector(
        '[data-testid="library-detection-accordion"]:nth-child(1) p',
        { timeout: 20000 }
      );
      const deprecatedGoogleSignInText = await interaction.getInnerText(
        frame,
        '[data-testid="library-detection-accordion"]:nth-child(1) p'
      );
      expect(deprecatedGoogleSignInText).toBe('Deprecated Google Sign-In');

      // Validate the "GIS" known breakages
      await frame.waitForSelector(
        '[data-testid="library-detection-accordion"]:nth-child(2) p',
        { timeout: 20000 }
      );
      const gisText = await interaction.getInnerText(
        frame,
        '[data-testid="library-detection-accordion"]:nth-child(2) p'
      );
      expect(gisText).toBe('Unsupported Google Identity Services');
    }, 120000);
  });

  describe('Disqus comments', () => {
    beforeEach(async () => {
      puppeteer = new PuppeteerManagement();
      await puppeteer.setup();
      page = await puppeteer.openPage();
    }, 40000);

    afterEach(async () => {
      await puppeteer.close();
    }, 40000);

    test('Should be able to validate the Known Breakages, Facebook Likes and Comments', async () => {
      await puppeteer.navigateToURL(
        page,
        'https://www.math-only-math.com/?psat_cdp=on'
      );
      page.reload();

      const devtools = await puppeteer.getDevtools();
      const key = puppeteer.getCMDKey();
      interaction = new Interaction(devtools, key);

      // Navigate to the cookie tab
      const frame = await interaction.navigateToCookieTab();
      if (!frame) {
        throw new Error('Content frame not found');
      }
      await interaction.delay(8000);
      // Validate the "Facebook Like" known breakages
      const facebookcomment = await interaction.getInnerText(
        frame,
        '[data-testid="library-detection-accordion"]:nth-child(1) p'
      );
      expect(facebookcomment).not.toBe(null);
      await interaction.delay(2000);
      // Validate the "Facebook Comment" known breakages
      const facebooklike = await interaction.getInnerText(
        frame,
        '[data-testid="library-detection-accordion"]:nth-child(2) p'
      );
      expect(facebooklike).toBe('Facebook Like Button');
    }, 60000);
  });

  describe('Facebook like and comment', () => {
    beforeEach(async () => {
      puppeteer = new PuppeteerManagement();
      await puppeteer.setup();
      page = await puppeteer.openPage();
    }, 40000);

    afterEach(async () => {
      await puppeteer.close();
    }, 40000);

    test('Should be able to validate the Known Breakages, Facebook Likes and Comments', async () => {
      await puppeteer.navigateToURL(
        page,
        'https://www.math-only-math.com/?psat_cdp=on'
      );
      page.reload();

      const devtools = await puppeteer.getDevtools();
      const key = puppeteer.getCMDKey();
      interaction = new Interaction(devtools, key);

      // Navigate to the cookie tab
      const frame = await interaction.navigateToCookieTab();
      if (!frame) {
        throw new Error('Content frame not found');
      }
      await interaction.delay(8000);
      // Validate the "Facebook Like" known breakages
      const facebookcomment = await interaction.getInnerText(
        frame,
        '[data-testid="library-detection-accordion"]:nth-child(1) p'
      );
      expect(facebookcomment).not.toBe(null);
      await interaction.delay(2000);
      // Validate the "Facebook Comment" known breakages
      const facebooklike = await interaction.getInnerText(
        frame,
        '[data-testid="library-detection-accordion"]:nth-child(2) p'
      );
      expect(facebooklike).toBe('Facebook Like Button');
    }, 1200000);
  });
});

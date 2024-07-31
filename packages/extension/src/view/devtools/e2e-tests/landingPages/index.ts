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

test('Should be able to validate the embedded privacy.com page title', async () => {
  await puppeteer.navigateToURL(page, 'https://bbc.com');

  const devtools = await puppeteer.getDevtools();
  const key = puppeteer.getCMDKey();
  interaction = new Interaction(devtools, key);

  // Navigate to Privacy Sandbox Tab
  const devtoolsTargets = await interaction.navigateToPrivacySandboxTab();

  // Validate the privacy sandbox embedded page title.
  const outerIframe = await devtoolsTargets.$(selectors.devtoolIframeSelector);

  if (!outerIframe) {
    throw new Error('Outer iframe not found');
  }

  const outerFrame = await outerIframe.contentFrame();
  await new Promise((resolve) => setTimeout(resolve, 4000));

  if (outerFrame) {
    // Get the privacySandboxEmbedded Iframe.
    const nestedIframe = await outerFrame.$(
      selectors.privacySandBoxEmbedIframeSelector
    );

    if (!nestedIframe) {
      throw new Error('Nested iframe not found');
    }

    const nestedFrame = await nestedIframe.contentFrame();

    // Validate the Privacy sandbox page title.
    if (nestedFrame) {
      const title = await nestedFrame.title();
      expect(title).toBe(
        'The Privacy Sandbox: Technology for a More Private Web'
      );

      // Check if the iframe is visible
      const isVisible = await nestedFrame.evaluate(() => {
        const style = getComputedStyle(document.body);
        return style.visibility !== 'hidden' && style.display !== 'none';
      });
      expect(isVisible).toBe(true);
    }
  }
}, 60000);

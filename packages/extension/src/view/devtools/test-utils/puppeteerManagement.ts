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

/*
 * External dependencies
 */
import fs from 'fs';
import path from 'path';
import { platform } from 'os';
import { Browser, Page, type Viewport, type KeyInput } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
//@ts-ignore
import puppeteerPrefs from 'puppeteer-extra-plugin-user-preferences';
import { USER_AGENT } from './constants';

const currentScriptDirectory = process.cwd();

const extensionRelativePath = '/dist/extension';
const extensionPath = path.join(currentScriptDirectory, extensionRelativePath);

const puppeteerArgs = [
  `--disable-extensions-except=${extensionPath}`,
  `--load-extension=${extensionPath}`,
  '--disable-features=DialMediaRouteProvider',
  '--auto-open-devtools-for-tabs',
  '--start-maximized',
];

/**
 * PuppeteerManagement class handles the management of the Puppeteer browser instance.
 * It provides methods for launching, navigating, and closing the Puppeteer browser.
 */
export class PuppeteerManagement {
  /**
   * The Puppeteer browser instance.
   */
  browser: Browser | null;

  /**
   * Creates an instance of the PuppeteerManagement class.
   */
  constructor() {
    this.browser = null;

    if (!fs.existsSync(extensionPath)) {
      throw new Error(`Directory '${extensionPath}' does not exist.`);
    }
  }

  async setup(extraArgs?: string[], defaultViewport?: Viewport) {
    puppeteer.use(
      puppeteerPrefs({
        userPrefs: {
          devtools: {
            preferences: {
              currentDockState: '"bottom"',
            },
          },
        },
      })
    );

    this.browser = await puppeteer.launch({
      headless: true,
      args: [...puppeteerArgs, ...(extraArgs || [])],
      devtools: true,
      defaultViewport: defaultViewport || null,
    });
  }

  async openPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }
    const sitePage = await this.browser.newPage();
    const pages = await this.browser.pages();
    if (pages.length > 1) {
      await pages[0].close();
    }

    await sitePage.setUserAgent(USER_AGENT);
    return sitePage;
  }

  async navigateToURL(page: Page, url: string) {
    await page.goto(url);
  }

  /**
   * Gets the devtools page for the current browser instance.
   * @async
   * @returns A Promise that resolves to the devtools page, or null if not found.
   */
  async getDevtools() {
    const targets = this.browser?.targets();
    const devtoolsTargets = targets?.find((t) => {
      return t.type() === 'other' && t.url().startsWith('devtools://');
    });
    if (!devtoolsTargets) {
      throw new Error('DevTools targets not found.');
    }
    const devtools = await devtoolsTargets.page();
    if (!devtools) {
      throw new Error('DevTools not found.');
    }

    return devtools;
  }

  /**
   * Gets the appropriate key (Meta or Control) based on the operating system.
   * @returns The key input value (either 'Meta' or 'Control').
   */
  getCMDKey() {
    let key: KeyInput;
    const sysplatform = platform();
    if (sysplatform === 'darwin') {
      key = 'Meta';
    } else {
      key = 'Control';
    }
    return key;
  }

  /**
   * Closes the Puppeteer browser instance.
   * @returns {Promise<void>} A promise that resolves when the browser is closed.
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

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
import { type KeyInput, Page, Frame } from 'puppeteer';
import { selectors } from './constants';

/**
 * The Interaction class provides methods for interacting with the Puppeteer browser,
 * including scrolling, opening panels and tabs, and extracting cookie data.
 */
export class Interaction {
  /**
   * The devtools page instance.
   */
  devtools: Page;

  /**
   * The key (Meta or Control) based on the operating system.
   */
  key: KeyInput;

  /**
   * Creates an instance of the Interaction class.
   * @param devtools - The devtools page instance.
   * @param key - The key (Meta or Control) based on the operating system.
   */
  constructor(devtools: Page, key: KeyInput) {
    this.devtools = devtools;
    this.key = key;
  }

  /**
   * Navigates to the Privacy Sandbox tab in the DevTools.
   * @returns {Promise<Page>} A promise that resolves to the DevTools page object.
   * @throws {Error} If the DevTools target or page is not found.
   */
  async navigateToPrivacySandboxTab(): Promise<Page> {
    if (!this.devtools) {
      throw new Error('Devtools page not found');
    }

    await this.devtools.keyboard.down(this.key);
    await this.devtools.keyboard.press('BracketLeft');
    await this.devtools.keyboard.up(this.key);

    return this.devtools;
  }

  /**
   * Navigates to the Cookies tab and clicks the analyze button.
   * @returns {Promise<Frame | null | undefined>} A promise that resolves to the frame object or null.
   * @throws {Error} If the DevTools iframe is not found.
   */
  async navigateToCookieTab(): Promise<Frame | null | undefined> {
    const devtoolsPage = await this.navigateToPrivacySandboxTab();
    await devtoolsPage.waitForSelector(selectors.devtoolIframeSelector);

    const iframeElement = await devtoolsPage.$(selectors.devtoolIframeSelector);
    const frame = await iframeElement?.contentFrame();

    await this.delay(2000);

    if (frame) {
      const elementTextToClick = 'Cookies';
      await this.clickMatchingElement(frame, 'p', elementTextToClick);

      await frame.waitForSelector(selectors.analyzeThisButtonSelector, {
        timeout: 5000,
      });
      const button = await frame.$(selectors.analyzeThisButtonSelector);
      await button?.click();

      const dropdown = await frame.waitForSelector(
        selectors.cookieDropDownSelector,
        {
          timeout: 10000,
        }
      );
      await dropdown?.click();
    }

    return frame;
  }

  /**
   * Gets the inner text of an element specified by a selector within a frame.
   * @param {Frame} frame - The Puppeteer frame in which to search for the element.
   * @param {string} selector - The selector used to find the element within the frame.
   * @returns {Promise<string | null>} A promise that resolves to the inner text of the element or null.
   */
  async getInnerText(
    frame: Frame | null,
    selector: string
  ): Promise<string | null> {
    if (!frame) {
      return null;
    }

    await this.delay(3000);
    const element = await frame.$(selector);

    if (element) {
      const innerText = await element.evaluate(
        (node: Element) => node.textContent?.trim() || null
      );
      return innerText;
    }

    return null;
  }

  /**
   * Navigates to the cookie frame for the current URL in the page.
   * @param {string} pageURL - The page URL
   * @returns {Promise<Frame | null>} A promise that resolves to the frame object or null if not found.
   */
  async navigateToCurrentURLCookieFrame(pageURL: string): Promise<Frame> {
    const frame = await this.navigateToCookieTab();
    if (!frame) {
      throw new Error('Unable to find the cookie tab frame');
    }

    await this.delay(3000);
    await this.clickMatchingElement(frame, 'p', pageURL);
    return frame;
  }

  /**
   * Gets all cookie names from the table's first column values within a frame.
   * @param {Frame} frame - The Puppeteer frame object.
   * @returns {Promise<string[]>} A promise that resolves to an array of cookie names.
   */
  async getCookieNames(frame: Frame): Promise<string[]> {
    const cookieTableRow = await frame.$$(selectors.tableRowsSelector);

    const cookieNames: string[] = [];

    cookieTableRow.map(async (row) => {
      const firstColumn = await row.$(selectors.firstRowSelector);

      if (firstColumn) {
        const searchQuery = await firstColumn.evaluate(
          (element: Element) => element.textContent || ''
        );
        cookieNames.push(searchQuery);
      }
    });

    return cookieNames;
  }

  /**
   * Checks if an element specified by a selector is visible within a frame.
   * @param {Frame} frame - The Puppeteer frame object.
   * @param {string} selector - The selector used to find the element within the frame.
   * @returns {Promise<boolean>} A promise that resolves to true if the element is visible, otherwise false.
   */
  async isElementVisible(frame: Frame, selector: string): Promise<boolean> {
    let elementVisible = false;
    try {
      const isVisible = await frame.$eval(selector, (element: Element) => {
        const style = getComputedStyle(element as HTMLElement);
        return (
          style && style.display !== 'none' && style.visibility !== 'hidden'
        );
      });

      if (typeof isVisible === 'boolean') {
        elementVisible = isVisible;
      }
    } catch (error) {
      elementVisible = false;
    }
    return elementVisible;
  }

  /**
   * Opens the filter options in the cookie table within a frame.
   * @param {Frame} frame - The Puppeteer frame object.
   * @returns {Promise<void>} A promise that resolves when the filter options are opened.
   */
  async openFilter(frame: Frame): Promise<void> {
    const buttonTitle = 'Open Filter Options';
    await frame.click(`button[title="${buttonTitle}"]`);
  }

  /**
   * Opens a specific filter option within a frame by matching its name.
   * @param {Frame} frame - The Puppeteer frame object.
   * @param {string} filterName - The name of the filter option to open.
   * @returns {Promise<void>} A promise that resolves when the filter option is opened.
   */
  async openFilterOption(frame: Frame, filterName: string): Promise<void> {
    await this.clickMatchingElement(frame, 'p', filterName);
  }

  /**
   * Clicks on a specific filter option within a frame by matching its name.
   * @param {Frame} frame - The Puppeteer frame object.
   * @param {string} filterOptionName - The name of the filter option to click.
   * @returns {Promise<void>} A promise that resolves when the filter option is clicked.
   */
  async clickOnFilterOption(
    frame: Frame,
    filterOptionName: string
  ): Promise<void> {
    await this.clickMatchingElement(frame, 'span', filterOptionName);
  }

  /**
   * Clicks on a specific column within a frame by matching its name.
   * @param {Frame | null} frame - The Puppeteer frame object or null.
   * @param {string} columnName - The name of the column to click.
   * @returns {Promise<void>} A promise that resolves when the column is clicked.
   */
  async clickOnColumn(frame: Frame | null, columnName: string): Promise<void> {
    if (!frame) {
      return;
    }

    await this.clickMatchingElement(frame, 'p', columnName);
  }

  /**
   * Navigates to the Settings tab in the DevTools.
   * @returns {Promise<Page>} A promise that resolves to the DevTools page object.
   * @throws {Error} If the DevTools iframe is not found.
   */
  async navigateToSettingsTab(): Promise<Page> {
    const devtoolsTargets = await this.navigateToPrivacySandboxTab();

    await devtoolsTargets.waitForSelector(selectors.devtoolIframeSelector);

    // Get the iframe
    const iframe = await devtoolsTargets.$(selectors.devtoolIframeSelector);

    if (!iframe) {
      throw new Error('DevTools iframe not found');
    }

    // Switch to the iframe of devtool
    const frame = await iframe.contentFrame();
    await this.delay(3000);

    if (frame) {
      // Click on the Private Advertising from the menu,
      await this.clickMatchingElement(frame, 'p', 'Settings');
    }
    return devtoolsTargets;
  }

  /**
   * Clears the search.
   * @param {Frame | null} frame - The Puppeteer frame object or null.
   */
  async clearSearch(frame: Frame | null): Promise<void> {
    if (!frame) {
      throw new Error('Frame is null');
    }

    await frame.waitForSelector(selectors.searchTextboxSelector);
    await frame.type(selectors.searchTextboxSelector, 'test', {
      delay: 100,
    });
    await frame.click('button[title="Clear Search"]');

    const searchString = await frame.$eval(
      selectors.searchTextboxSelector,
      (input: Element) => {
        const inputElement = input as HTMLInputElement;
        return inputElement.value;
      }
    );

    expect(searchString).toBe('');
  }

  /**
   * Clicks the elements within a frame that match the specified text.
   * @param {Frame} frame - The Puppeteer frame in which to search for elements.
   * @param {string} selector - The selector used to find elements within the frame.
   * @param {string} textToMatch - The text to match against the elements' inner text.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async clickMatchingElement(
    frame: Frame,
    selector: string,
    textToMatch: string
  ): Promise<void> {
    const elements = await frame.$$(selector);

    // Create an array of promises to get the innerText of each element
    const elementTexts = await Promise.all(
      elements.map((element) =>
        element.evaluate((node) => (node as HTMLElement).innerText)
      )
    );

    // Find the index of the element that matches the text
    const matchingIndex = elementTexts.findIndex(
      (text) => text === textToMatch
    );
    // If a matching element is found, click it
    if (matchingIndex !== -1) {
      await elements[matchingIndex].click();
    }
  }

  /**
   * Delay by using setTimeout.
   * @param ms delay in miliseconds
   * @returns a promise that will resolve in given amount of miliseconds
   */
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

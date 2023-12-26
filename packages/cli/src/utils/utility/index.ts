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
import promptly from 'promptly';
import Sitemapper from 'sitemapper';

/**
 * Internal dependencies.
 */
import { Cookie } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Table = require('cli-table');

export default class Utility {
  /**
   * Create chunk of array from array.
   * @param {Array<any>} list List.
   * @param {number} batchSize Batch size.
   * @returns {Array<Array<any>>} List of chunks.
   */
  public static chunk(list: Array<any>, batchSize = 5): Array<Array<any>> {
    const chunks: Array<Array<any>> = [];

    for (let i = 0; i < list.length; i += batchSize) {
      chunks.push(list.slice(i, i + batchSize));
    }
    return chunks;
  }

  /**
   * Pluck given key from list of object.
   * @param {Array<object>} list List of object.
   * @param {string} key Key to pluck.
   * @returns {Array<any>} List of value.
   */
  public static listPluck(list: Array<object>, key: string): Array<any> {
    const output: Array<any> = [];

    // eslint-disable-next-line array-callback-return
    list.map((listItem: object) => {
      if (listItem && key in listItem) {
        output.push(listItem[key as keyof object]);
      }
    });

    return output;
  }

  /**
   * Remove the key from object.
   * @param {Array} list List of objects.
   * @param {Array} keys Key that need to remove.
   * @returns {Array} List of object without key.
   */
  public static listRemoveKey(
    list: Array<object>,
    keys: Array<string>
  ): Array<object> {
    const output: Array<object> = [...list];

    // eslint-disable-next-line array-callback-return
    output.map((listItem: object) => {
      keys.forEach((key) => {
        delete listItem[key as keyof object];
      });
    });

    return output;
  }

  /**
   * Convert object into pretty JSON.
   * @param {object|Array<any>} data Data.
   * @returns <string> Pretty JSON string.
   */
  public static prettyJson(data: object | Array<any>): string {
    return JSON.stringify(data, null, 4);
  }

  public static mergeObjects(object1: object, object2: object): object {
    const output: { [key: string]: any } = { ...object1 };

    Object.entries(object2).forEach(([key, value]) => {
      output[key] = value;
    });

    return output;
  }

  /**
   * Merge all the array.
   * @param {Array<Array<any>>} list List of Arrays.
   * @returns {Array<any>} Merged array.
   */
  public static mergeAll(list: Array<Array<any>>): Array<any> {
    let allData: Array<any> = [];

    // eslint-disable-next-line array-callback-return
    list.map((listItem: object) => {
      // @ts-ignore
      if (listItem) {
        // @ts-ignore
        allData = [...allData, ...listItem];
      }
    });

    return allData;
  }

  /**
   * Get List of urls from sitemap url.
   * @param {string} sitemapURL Site map URL.
   * @returns {Promise<Array<string>>} List of URLs.
   */
  public static async getUrlsFromSitemap(
    sitemapURL: string
  ): Promise<Array<string>> {
    const siteMapper = new Sitemapper({
      url: sitemapURL,
      timeout: 3000,
    });

    let urls: Array<string> = [];
    try {
      const { sites } = await siteMapper.fetch();
      urls = sites;
    } catch (error) {
      console.log('Error: error parsing sitemap ');
    }

    return urls;
  }

  /**
   * Ask user input.
   * @param {string} message Message to user.
   * @param {object} options Options.
   * @returns {Promise<any>} User's input.
   */
  public static async askUserInput(
    message: string,
    options: object = {}
  ): Promise<string> {
    const userInput: string = await promptly.prompt(message, options);
    return userInput;
  }

  /**
   * Parse cookies from string.
   * @param {string} cookiesString Browser cookies string.
   * @returns {Array} List of cookies.
   */
  public static parseCookies(cookiesString: string): Array<Cookie> {
    const cookies: Array<Cookie> = [];
    const rows: Array<string> = cookiesString.split('\n');

    rows.forEach((row) => {
      const cookie: Cookie = Utility.parseCookieLine(row);
      cookies.push(cookie);
    });

    return cookies;
  }

  /**
   * Parse cookie line.
   * @param cookieLine
   * @returns Cookie
   */
  public static parseCookieLine(cookieLine: string): Cookie {
    const regex = /[;]{1,9}/gm;
    cookieLine = cookieLine.replace(regex, ';');

    const segments = cookieLine.split(';');
    const allColumns = segments.map((v) => v.split('='));
    // @ts-ignore
    const cookie: Cookie = {
      name: '',
      value: '',
      expires: 0,
      path: '',
      domain: '',
      httpOnly: false,
      secure: false,
      sameSite: undefined,
    };

    const cookieKeys: Array<string> = [
      'expires',
      'path',
      'domain',
      'httponly',
      'secure',
      'samesite',
    ];

    allColumns.forEach((currentValue) => {
      let key: string = currentValue.shift() ?? '';
      key = Utility.decodeURI(key);

      if ('max-age' === key.toLowerCase()) {
        key = 'expires';
      }

      let value = currentValue.join('=');
      value = Utility.decodeURI(value);

      if (!key) {
        return;
      }

      if (!cookie['name'] && !cookieKeys.includes(key.toLowerCase())) {
        cookie['name'] = key;
        cookie['value'] = value;
      } else if (['httponly', 'secure'].includes(key.toLowerCase())) {
        // @ts-ignore
        cookie[key.toLowerCase()] = true;
      } else if (key) {
        // @ts-ignore
        cookie[key.toLowerCase()] = value;
      }
    });

    return cookie;
  }

  public static decodeURI(value: any): any {
    try {
      value = decodeURIComponent(value.trim());
    } catch (exception) {
      console.error('Utility:decodeURI : ', exception, ' Value : ', value);
      value = '';
    }

    return value;
  }

  /**
   * Get printable table in CLI from Array of object.
   * @param {Array<object>} items Array og object.
   * @returns {object}
   */
  public static getCliTable(items: Array<object>): object {
    if (!items || 0 === items.length) {
      return {};
    }

    const table = new Table({
      // @ts-ignore
      head: Object.keys([...items].shift()),
    });

    items.forEach((item) => {
      table.push(Object.values(item));
    });

    return table;
  }

  /**
   * Sort the object by key.
   * @param {object} object Object to sort
   * @returns {object} Object sorted by key.
   */
  public static sortObjectByKey(object: { [key: string]: string }): object {
    return Object.keys(object)
      .sort()
      .reduce((result: { [key: string]: string }, key: string) => {
        result[key] = object[key];
        return result;
      }, {});
  }

  /**
   * Generate Prefix.
   * @param   {string} url Url in a string format.
   * @returns {string} string with protocol removed and special characters replaces with "-".
   */
  public static generatePrefix(url: string): string {
    const urlObject = new URL(url);

    return urlObject.hostname.replace('.', '-');
  }
}

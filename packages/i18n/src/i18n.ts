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
import { IntlMessageFormat } from 'intl-messageformat';
/**
 * Class representing Internationalization (i18n) functionality.
 */
class I18n {
  private messages: {
    [key: string]: {
      message: string;
      description: string;
      placeholders: {
        [key: string]: {
          content: string;
          example: string;
        };
      };
    };
  } = {};

  private locale = 'en';

  /**
   * Initializes the messages object with the provided messages.
   * @param {object} messages - The messages object containing translations.
   */
  initMessages(messages = {}) {
    this.messages = messages;
  }

  /**
   *	Returns the locale string.
   * @returns {string} The locale string.
   */
  getLocale() {
    if (typeof chrome !== 'undefined' && chrome?.i18n?.getUILanguage) {
      return chrome.i18n.getUILanguage();
    }

    return this.locale;
  }

  /**
   * Returns the messages object.
   * @returns {object} The messages object.
   */
  getMessages() {
    return this.messages;
  }

  /**
   * Creates an array of possible locale strings based on the provided locale.
   * @param {string} locale - The locale string.
   * @returns {string[]} An array of locale strings.
   */
  private createLocaleArray(locale: string) {
    if (!locale) {
      return ['en'];
    }

    return [
      locale,
      locale.replace(/_/g, '-'),
      locale.replace(/-/g, '_'),
      locale.split('-')[0],
      locale.split('_')[0],
      'en',
    ];
  }

  /**
   * Asynchronously loads messages data using the provided locale.
   * @param {string} locale - The locale string.
   * @returns {Promise<void>} A promise that resolves when messages are loaded.
   */
  async fetchMessages(locale: string) {
    const localeArray = this.createLocaleArray(locale);

    let idx = 0;

    const fetchWithRetry = async () => {
      let res = {};

      if (idx >= localeArray.length) {
        return res;
      }

      try {
        const response = await fetch(
          `/_locales/${localeArray[idx]}/messages.json`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch messages for locale ${localeArray[idx]}`
          );
        }

        const data = await response.json();
        res = data;

        this.locale = localeArray[idx];
      } catch (error) {
        idx++;
        res = await fetchWithRetry();
      }

      return res;
    };

    const result = await fetchWithRetry();
    return result;
  }

  /**
   * Loads messages data for the CLI.
   * @param {string} locale - The locale string.
   */
  async loadCLIMessagesData(locale: string) {
    const localeArray = this.createLocaleArray(locale);

    for (const _locale of localeArray) {
      try {
        let response;
        try {
          /* eslint-disable no-await-in-loop */
          response = await fetch(
            `../../../../node_modules/@google-psat/i18n/_locales/messages/${_locale}/messages.json`
          );
        } catch {
          response = await fetch(
            `../../../i18n/_locales/messages/${_locale}/messages.json`
          );
        }

        if (!response?.ok) {
          continue;
        }

        const messages = await response.json();
        this.initMessages(messages);
        this.locale = _locale;
        break;
        /* eslint-enable no-await-in-loop */
      } catch (error) {
        continue;
      }
    }
  }

  /**
   * Retrieves a translated message for a given key.
   * @param {string} key - The key of the message to retrieve.
   * @param {string[]} [substitutions] - An array of substitution values for placeholders in the message.
   * @param {boolean} [escapeLt] - Whether to escape '<' characters.
   * @returns {string} The translated message.
   */
  getMessage(key: string, substitutions?: string[], escapeLt?: boolean) {
    if (typeof chrome !== 'undefined' && chrome?.i18n?.getMessage) {
      try {
        // @ts-ignore - Outdated definition.
        const text = chrome.i18n.getMessage(key, substitutions, {
          escapeLt: Boolean(escapeLt),
        });

        return text;
      } catch (error) {
        console.log(error);
      }
    }

    return this._parseMessage(key, substitutions, escapeLt);
  }

  /**
   * Parses a message with substitutions and placeholders.
   * @param {string} key - The key of the message to parse.
   * @param {string[]} [substitutions] - An array of substitution values for placeholders in the message.
   * @param {boolean} [escapeLt] - Whether to escape '<' characters.
   * @returns {string} The parsed message.
   */
  private _parseMessage(
    key: string,
    substitutions?: string[],
    escapeLt?: boolean
  ) {
    const messageObj = this.messages?.[key];

    if (!messageObj) {
      return '';
    }

    const message = messageObj.message
      .split('$')
      .map((part, idx) => (idx % 2 ? `{${part}}` : part))
      .join('');

    const placeholders = Object.entries(messageObj.placeholders || {}).reduce<{
      [key: string]: string;
    }>((acc, [placeholderKey, val]) => {
      const idx = Number(val.content.substring(1)) - 1;

      acc[placeholderKey] = substitutions?.[idx] || '';

      return acc;
    }, {});

    return new IntlMessageFormat(message, 'en', undefined, {
      ignoreTag: escapeLt,
    }).format(placeholders) as string;
  }

  /**
   * Returns messages wrapped with HTML tags.
   * Prefix keys with 'header_{key}', 'body_{count}_{key}' to wrap with appropriate tags.
   * @param keys - The keys of the messages to retrieve.
   * @returns {string} The formatted messages.
   */
  getFormattedMessages(keys: string[]) {
    return keys
      ?.map((key) => {
        const [type] = key.split('_');

        const message = this.getMessage(key);

        switch (type) {
          case 'header':
            return `<h1 className='font-semibold'>${message}</h1>`;
          case 'body':
            return `<p>${message}</p>`;
          default:
            return message;
        }
      })
      .join('');
  }
}

export default new I18n();

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
import { existsSync, readFileSync } from 'fs';
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

  /**
   * Initializes the messages object with the provided messages.
   * @param {object} messages - The messages object containing translations.
   */
  initMessages(messages = {}) {
    this.messages = messages;
  }

  /**
   * Creates an array of possible locale strings based on the provided locale.
   * @param {string} locale - The locale string.
   * @returns {string[]} An array of locale strings.
   */
  private createLocaleArray(locale: string) {
    return [locale, locale.split('-')[0], locale.split('_')[0], 'en'];
  }

  /**
   * Asynchronously loads messages data for the dashboard.
   * @param {string} locale - The locale string.
   * @returns {Promise<void>} A promise that resolves when messages are loaded.
   */
  async loadDashboardMessagesData(locale: string) {
    const localeArray = this.createLocaleArray(locale);

    let idx = 0;

    const fetchWithRetry = async () => {
      if (idx >= localeArray.length) {
        return;
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

        this.initMessages(data);
      } catch (error) {
        idx++;
        await fetchWithRetry();
      }
    };

    await fetchWithRetry();
  }

  /**
   * Loads messages data for the CLI.
   * @param {string} locale - The locale string.
   */
  loadCLIMessagesData(locale: string) {
    const localeArray = this.createLocaleArray(locale);

    for (const _locale of localeArray) {
      if (
        existsSync(`packages/i18n/_locales/messages/${_locale}/messages.json`)
      ) {
        const messages = JSON.parse(
          readFileSync(
            `packages/i18n/_locales/messages/${_locale}/messages.json`,
            {
              encoding: 'utf-8',
            }
          )
        );

        this.initMessages(messages);
        break;
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
      // @ts-ignore - Outdated definition.
      return chrome.i18n.getMessage(key, substitutions, {
        escapeLt: Boolean(escapeLt),
      });
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
}

export default new I18n();

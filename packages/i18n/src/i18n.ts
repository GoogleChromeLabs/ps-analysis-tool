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

import { IntlMessageFormat } from 'intl-messageformat';

class I18n {
  private messages: any;

  initMessages(messages = {}) {
    this.messages = messages;
  }

  getMessage(key: string, substitutions?: string[], escapeLt?: boolean) {
    if (window?.location?.protocol === 'chrome-extension:') {
      // @ts-ignore - Outdated definition.
      return chrome.i18n.getMessage(key, substitutions, {
        escapeLt: Boolean(escapeLt),
      });
    }

    return this._parseMessage(key, substitutions, escapeLt);
  }

  private _parseMessage(
    key: string,
    substitutions?: string[],
    escapeLt?: boolean
  ) {
    const messageObj: {
      message: string;
      description: string;
      placeholders: {
        [key: string]: {
          content: string;
          example: string;
        };
      };
    } = this.messages[key];

    if (!messageObj) {
      return '';
    }

    const message = messageObj.message
      .split('$')
      .map((part, idx) => {
        if (idx % 2) {
          return '{' + part + '}';
        }

        return part;
      })
      .join('');

    const placeholders = Object.entries(messageObj.placeholders || {}).reduce<{
      [key: string]: string;
    }>((acc, [placeholderKey, val]) => {
      const idx = Number(val.content.substring(1)) - 1;

      if (substitutions?.[idx]) {
        acc[placeholderKey] = substitutions[idx];
      } else {
        acc[placeholderKey] = '';
      }

      return acc;
    }, {});

    return new IntlMessageFormat(message, 'en', undefined, {
      ignoreTag: escapeLt,
    }).format(placeholders) as string;
  }
}

export default new I18n();

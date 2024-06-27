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
import fs from 'fs';
import path from 'path';

/**
 * Internal dependencies.
 */
import I18n from '../i18n';

describe('I18n', () => {
  // mock fetch function
  const fetchMock = jest.fn();

  beforeAll(() => {
    global.fetch = fetchMock;
  });

  afterAll(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it('should load messages data for the dashboard', async () => {
    const locale = 'en';
    const messages = {
      'test.message': {
        message: 'Test message for $name$',
        description: 'Test message description',
        placeholders: {
          name: {
            content: '$1',
            example: 'John Doe',
          },
        },
      },
    };

    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve(messages),
      ok: true,
    });

    const result = await I18n.fetchMessages(locale);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/_locales/en/messages.json');

    expect(result).toEqual(messages);
  });
  it('should load CLI messages data', async () => {
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync');
    const locale = 'hi';
    const messages = {
      'test.message': {
        message: 'Test message for $name$',
        description: 'Test message description',
        placeholders: {
          name: {
            content: '$1',
            example: 'John Doe',
          },
        },
      },
    };

    readFileSyncMock.mockReturnValueOnce(JSON.stringify(messages));
    await I18n.loadCLIMessagesData(locale);

    expect(existsSyncMock).toHaveBeenNthCalledWith(
      2,
      path.resolve(__dirname + `../../../_locales/messages/hi/messages.json`)
    );
    expect(existsSyncMock).toHaveBeenCalledTimes(2);

    expect(readFileSyncMock).toHaveBeenCalledWith(
      path.resolve(__dirname + `../../../_locales/messages/hi/messages.json`),
      {
        encoding: 'utf-8',
      }
    );
    expect(readFileSyncMock).toHaveBeenCalledTimes(1);

    expect(I18n.getMessage('test.message', ['Sam'])).toEqual(
      'Test message for Sam'
    );
  });
});

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
import '@testing-library/jest-dom';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import getFrameType from '../getFrameType';

describe('getFrameType', () => {
  beforeAll(() => {
    globalThis.chrome.i18n = null;

    I18n.initMessages({
      hiddenIframe: {
        message: 'Hidden iframe',
      },
      nestedIframe: {
        message: 'Nested iframe',
      },
      mainFrame: {
        message: 'Main frame',
      },
      iframe: {
        message: 'iframe',
      },
    });
  });

  it('should return frame type (Hidden iframe)', () => {
    const iframe = document.createElement('iframe');

    expect(getFrameType(true, null, 'BODY')).toBe('Hidden iframe');
    expect(getFrameType(true, null, 'DIV')).toBe('Hidden iframe');
    expect(getFrameType(true, iframe, 'BODY')).toBe('Hidden iframe');
    expect(getFrameType(true, iframe, 'DIV')).toBe('Hidden iframe');
  });

  it('should return frame type (Nested iframe)', () => {
    const iframe = document.createElement('iframe');

    expect(getFrameType(false, iframe, 'BODY')).toBe('Nested iframe');
    expect(getFrameType(false, iframe, 'DIV')).toBe('Nested iframe');
  });

  it('should return frame type (Main frame)', () => {
    expect(getFrameType(false, null, 'BODY')).toBe('Main frame');
  });

  it('should return frame type (iframe)', () => {
    expect(getFrameType(false, null, 'DIV')).toBe('iframe');
    expect(getFrameType(false, null, 'SPAN')).toBe('iframe');
  });
});

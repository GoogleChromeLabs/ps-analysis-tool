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
import { I18n } from '@google-psat/i18n';

const validateUrl = (url: string) => {
  const message = I18n.getMessage('shouldMatchFormat');
  let _url;

  if (!url || typeof url !== 'string') {
    return `Url ${message}`;
  }

  try {
    _url = new URL(url);
    if (_url.protocol === 'https') {
      return '';
    }
  } catch (err) {
    return `Url ${message}`;
  }

  return `Url ${message}`;
};

export default validateUrl;

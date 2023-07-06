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
 * Internal dependencies.
 */
import type { CookieData } from '../../../../../../../localStore';

const getFilterValue = (keys: string, cookieData: CookieData): string => {
  const _keys = keys.split('.');
  const rootKey = _keys[0];
  const subKey = _keys[1];
  let value = '';

  if (!subKey) {
    value = cookieData[rootKey] || '';
  } else {
    value =
      cookieData[rootKey] && cookieData[rootKey][subKey]
        ? cookieData[rootKey][subKey]
        : '';
  }

  return value;
};

export default getFilterValue;

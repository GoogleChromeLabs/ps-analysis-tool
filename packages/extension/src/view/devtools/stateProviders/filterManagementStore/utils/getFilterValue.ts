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
import type { CookieTableData } from '@cookie-analysis-tool/common/src/cookies.types';

const getFilterValue = (keys: string, cookieData: CookieTableData) => {
  const _keys = keys.split('.');
  const rootKey = _keys[0] as keyof CookieTableData;
  const subKey = _keys[1] as keyof CookieTableData[keyof CookieTableData];
  let value: any = ''; // eslint-disable-line @typescript-eslint/no-explicit-any -- Value can of any

  if (cookieData && cookieData[rootKey]) {
    value = subKey ? cookieData[rootKey]?.[subKey] : cookieData[rootKey];
  }

  return value;
};

export default getFilterValue;

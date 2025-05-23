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
import { useCallback, useEffect } from 'react';
import { getCookieKey, type TabCookies } from '@google-psat/common';
import { isEqual } from 'lodash-es';
/**
 * Internal dependencies.
 */
import { isCookieDomainInAllowList } from '../../../../stateProviders/allowedList/utils';

const useHighlighting = (
  cookies: TabCookies,
  domainsInAllowList: Set<string>,
  setTableData: React.Dispatch<React.SetStateAction<TabCookies>>
) => {
  const handleHighlighting = useCallback(
    (cookiesToProcess: TabCookies) =>
      Object.values(cookiesToProcess).reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;

        acc[key] = {
          ...cookie,
          isDomainInAllowList: isCookieDomainInAllowList(
            cookie.parsedCookie?.domain || '',
            domainsInAllowList
          ),
        };

        return acc;
      }, {} as TabCookies),
    [domainsInAllowList]
  );

  useEffect(() => {
    setTableData((prevState) => {
      let newData: TabCookies = {};
      if (Object.values(cookies).length > 0) {
        newData = handleHighlighting(cookies);
      }

      if (isEqual(prevState, newData)) {
        return prevState;
      }
      return newData;
    });
  }, [cookies, handleHighlighting, setTableData, domainsInAllowList?.size]);
};

export default useHighlighting;

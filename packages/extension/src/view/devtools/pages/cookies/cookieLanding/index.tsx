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
 * External dependencies
 */
import React, { memo, useMemo, useState } from 'react';
import {
  getCookieKey,
  noop,
  type CookieTableData,
  type TabCookies,
} from '@google-psat/common';
import {
  TableChipsBar,
  FilterIcon,
  TableFiltersSidebar,
  useGlobalFiltering,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies
 */
import Landing from './landing';
import { useCookie } from '../../../stateProviders';

const AssembledCookiesLanding = () => {
  const { tabCookies } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
  }));

  const cookies = useMemo(() => Object.values(tabCookies || {}), [tabCookies]);

  const filter = useGlobalFiltering(cookies, '', noop);

  const cookiesByKey = useMemo(() => {
    return filter.filteredData.reduce<TabCookies>((acc, cookie) => {
      const cookieKey = getCookieKey((cookie as CookieTableData).parsedCookie);

      if (!cookieKey) {
        return acc;
      }

      acc[cookieKey] = cookie as CookieTableData;

      return acc;
    }, {});
  }, [filter.filteredData]);

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center items-center gap-2 flex-1 border-b border-gray-300 dark:border-quartz bg-anti-flash-white dark:bg-raisin-black">
        <button
          className="w-3 h-3 m-1 px-1"
          onClick={() => setShowFilterSidebar(!showFilterSidebar)}
          title={I18n.getMessage('openFilterOptions')}
        >
          <FilterIcon
            className={
              showFilterSidebar
                ? 'text-royal-blue dark:text-medium-persian-blue'
                : 'text-mischka'
            }
          />
        </button>
        <TableChipsBar {...filter} />
      </div>
      <div
        className="flex grow-0"
        style={{
          height: 'calc(100% - 26px)',
        }}
      >
        {showFilterSidebar && (
          <Resizable
            minWidth="100px"
            maxWidth="50%"
            enable={{
              right: true,
            }}
            className="border border-r border-gray-300 dark:border-quartz"
          >
            <TableFiltersSidebar {...filter} />
          </Resizable>
        )}
        <div
          className="flex-1 overflow-auto h-full"
          id="cookies-landing-scroll-container"
        >
          <Landing
            tabCookies={cookiesByKey}
            appliedFilters={filter.selectedFilters}
          />
        </div>
      </div>
    </div>
  );
};
export default memo(AssembledCookiesLanding);

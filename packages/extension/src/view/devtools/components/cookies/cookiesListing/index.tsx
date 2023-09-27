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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';

import { useFilterManagementStore } from '../../../stateProviders/filterManagementStore';
import ChipsBar from '../cookieFilter/chips';
import CookieTopBar from '../cookieTopBar';
import FiltersList from '../cookieFilter';
import type { CookieTableData } from '@cookie-analysis-tool/common';
import { CookieDetails } from '@cookie-analysis-tool/design-system';
import CookieTableContainer from './cookieTableContainer';

const CookiesListing = () => {
  const { selectedFrame } = useCookieStore(({ state }) => ({
    selectedFrame: state.selectedFrame,
  }));

  const { filteredCookies, cookiesAvailable } = useFilterManagementStore(
    ({ state }) => ({
      filteredCookies: state.filteredCookies,
      cookiesAvailable: state.cookiesAvailable,
    })
  );

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);

  const [selectedFrameCookie, setSelectedFrameCookie] = useState<{
    [frame: string]: CookieTableData | null;
  } | null>(null);

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen((p) => !p);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <CookieTopBar
        cookiesAvailable={cookiesAvailable}
        isFilterMenuOpen={isFilterMenuOpen}
        toggleFilterMenu={toggleFilterMenu}
        filteredCookies={filteredCookies}
      />
      {cookiesAvailable && <ChipsBar />}
      <div className="w-full flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <Resizable
            defaultSize={{
              width: '100%',
              height: '80%',
            }}
            minHeight="6%"
            maxHeight="95%"
            enable={{
              top: false,
              right: false,
              bottom: true,
              left: false,
            }}
          >
            <div className="h-full flex">
              {cookiesAvailable
                ? isFilterMenuOpen && (
                    <Resizable
                      minWidth="10%"
                      maxWidth="50%"
                      enable={{
                        top: false,
                        right: true,
                        bottom: false,
                        left: false,
                      }}
                      className="overflow-y-scroll overflow-x-hidden p-3"
                    >
                      <FiltersList />
                    </Resizable>
                  )
                : null}

              <div className="flex-1 overflow-auto">
                <CookieTableContainer
                  cookies={filteredCookies}
                  selectedFrame={selectedFrame}
                  selectedFrameCookie={selectedFrameCookie}
                  setSelectedFrameCookie={setSelectedFrameCookie}
                />
              </div>
            </div>
          </Resizable>
          <div className="w-full h-full border border-gray-300 dark:border-quartz shadow overflow-auto">
            <CookieDetails selectedFrameCookie={selectedFrameCookie} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesListing;

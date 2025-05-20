/*
 * Copyright 2024 Google LLC
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
import React, { useCallback, useEffect } from 'react';
import {
  CardsPanel,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { FEATURE_LIST } from './constants';
import { useCookie } from '../../../stateProviders';

const Dashboard = () => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);
  const { tabFrames } = useCookie(({ state }) => ({
    tabFrames: state.tabFrames,
  }));

  const handleButtonClick = useCallback(
    (event: React.MouseEvent, sidebarKey: string) => {
      event.preventDefault();
      event.stopPropagation();

      const firstFrame =
        Object.keys(tabFrames || {})?.[0] || SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX;

      navigateTo(sidebarKey === 'FIRST_COOKIE_TABLE' ? firstFrame : sidebarKey);
    },
    [navigateTo, tabFrames]
  );

  useEffect(() => {
    if (FEATURE_LIST[0].buttons.length === 1) {
      FEATURE_LIST[0].buttons.push({
        name: 'Cookies Table',
        sidebarKey: 'FIRST_COOKIE_TABLE' as SIDEBAR_ITEMS_KEYS,
      });
    }
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div>
        <CardsPanel
          featuredItems={FEATURE_LIST}
          onFeaturedButtonClick={handleButtonClick}
          hasTitle={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;

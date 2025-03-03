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
import React from 'react';
import {
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  CardsPanel,
} from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import { FEATURED_ITEMS } from './constants';

const ContentPanel = () => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  const onButtonClick = (
    event: React.MouseEvent,
    sidebarKey: SIDEBAR_ITEMS_KEYS
  ) => {
    event.preventDefault();
    event.stopPropagation();
    navigateTo(sidebarKey);
  };

  return (
    <CardsPanel
      featuredItems={FEATURED_ITEMS}
      onFeaturedButtonClick={onButtonClick}
      hasTitle={false}
    />
  );
};

export default ContentPanel;

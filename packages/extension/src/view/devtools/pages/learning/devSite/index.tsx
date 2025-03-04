/*
 * Copyright 2025 Google LLC
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
  DevGuideIcon,
  ExternalLinkPanel,
  SIDEBAR_ITEMS_KEYS,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { FEATURED_ITEMS } from '../constants';

const DevSite = () => {
  const description =
    FEATURED_ITEMS.find(
      (item) => item.sidebarKey === SIDEBAR_ITEMS_KEYS.DEV_SITE
    )?.description ?? '';

  const devIcon = (
    <DevGuideIcon className="w-10 h-10 fill-granite-gray dark:fill-bright-gray" />
  );

  return <ExternalLinkPanel description={description} icon={devIcon} />;
};

export default DevSite;

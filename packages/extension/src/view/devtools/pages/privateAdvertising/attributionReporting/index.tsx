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
import React, { useMemo } from 'react';
import {
  InfoCard,
  PSInfoKey,
  TabsProvider,
  type TabItems,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import ActiveSources from './activeSources';
import SourceRegistrations from './sourceRegistrations';
import TriggerRegistrations from './triggerRegistrations';

const AttributionReporting = () => {
  const tabItems = useMemo<TabItems>(
    () => ({
      Learning: [
        {
          title: 'Overview',
          content: {
            Element: InfoCard,
            props: {
              infoKey: PSInfoKey.AttributionReporting,
              showQuickLinks: true,
              isLandingPageContainer: true,
            },
            className: 'p-4',
          },
        },
      ],
      Observability: [
        {
          title: 'Active Sources',
          content: {
            Element: ActiveSources,
            className: 'overflow-hidden h-full',
            containerClassName: 'h-full',
          },
        },
        {
          title: 'Source Registrations',
          content: {
            Element: SourceRegistrations,
            className: 'overflow-hidden h-full',
            containerClassName: 'h-full',
          },
        },
        {
          title: 'Trigger Registrations',
          content: {
            Element: TriggerRegistrations,
            className: 'overflow-hidden h-full',
            containerClassName: 'h-full',
          },
        },
      ],
    }),
    []
  );

  return (
    <TabsProvider items={tabItems} name="attribution-reporting">
      <Panel />
    </TabsProvider>
  );
};

export default AttributionReporting;

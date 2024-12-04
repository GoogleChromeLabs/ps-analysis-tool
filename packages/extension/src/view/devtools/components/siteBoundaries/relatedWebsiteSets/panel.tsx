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
import {
  Breadcrumbs,
  QuickLinksList,
  Tabs,
  useSidebar,
  useTabs,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import React from 'react';

const Panel = () => {
  const { extractSelectedItemKeyTitles } = useSidebar(({ actions }) => ({
    extractSelectedItemKeyTitles: actions.extractSelectedItemKeyTitles,
  }));

  const { panel } = useTabs(({ state }) => ({
    panel: state.panel,
  }));

  const ActiveTabContent = panel.Element;
  const { props } = panel;

  return (
    <div data-testid="related-website-sets-content" className="h-full w-full">
      <div className="p-4 flex flex-col gap-1 mb-2">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">{I18n.getMessage('rws')}</h1>
        </div>
        <Breadcrumbs items={extractSelectedItemKeyTitles()} />
      </div>
      <Tabs />
      <div className="p-4 max-w-2xl">
        {ActiveTabContent && <ActiveTabContent {...props} />}
      </div>
      <div className="mx-4 mt-8 border-t border-gray-300 dark:border-quartz">
        <QuickLinksList />
      </div>
    </div>
  );
};

export default Panel;

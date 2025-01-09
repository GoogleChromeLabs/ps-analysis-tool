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
 * External dependencies
 */
import { Tabs, useTabs } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import classNames from 'classnames';
import React, { useMemo } from 'react';
/**
 * Internal dependencies
 */
import SingleTabAnalysisBanner from '../../singleTabAnalysisBanner';

const Panel = () => {
  const { panel, titles, activeTab } = useTabs(({ state }) => ({
    panel: state.panel,
    titles: state.titles,
    activeTab: state.activeTab,
  }));
  const { className, props } = panel;

  const tabToBeShown = useMemo(() => {
    const ActiveTabContent = panel.Element;
    if (!ActiveTabContent) {
      return <></>;
    }

    if (titles[activeTab] === 'Overview') {
      return <ActiveTabContent {...props} />;
    }
    return (
      <SingleTabAnalysisBanner>
        <ActiveTabContent {...props} />
      </SingleTabAnalysisBanner>
    );
  }, [activeTab, panel.Element, props, titles]);

  return (
    <div
      data-testid="protected-audience-content"
      className="h-screen w-full flex flex-col overflow-hidden"
    >
      <div className="p-4">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">{I18n.getMessage('protectedAudience')}</h1>
        </div>
      </div>
      <Tabs />
      <div
        className={classNames('overflow-auto', className)}
        style={{
          minHeight: 'calc(100% - 93px)',
        }}
      >
        {tabToBeShown}
      </div>
    </div>
  );
};

export default Panel;

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
  InternalNavigationForAnchor,
  SIDEBAR_ITEMS_KEYS,
  Breadcrumbs,
  Tabs,
  useSidebar,
  useTabs,
} from '@google-psat/design-system';
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

  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  const { className, props } = panel;

  const tabToBeShown = useMemo(() => {
    const ActiveTabContent = panel.Element;

    if (!ActiveTabContent) {
      return <></>;
    }

    const customMessaging = (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center">
          Enable multi-tab debugging for enhanced analysis of the Protected
          Audience API.&nbsp;
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={() => {
              document
                .getElementById('cookies-landing-scroll-container')
                ?.scrollTo(0, 0);
              updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
            }}
          >
            {I18n.getMessage('settingsPage')}.
          </button>
        </div>
        <div className="flex w-full items-center justify-center">
          {I18n.getMessage('visitPSAT')}&nbsp;
          <InternalNavigationForAnchor
            text={'<a>' + I18n.getMessage('wiki') + '.</a>'}
            to={[SIDEBAR_ITEMS_KEYS.WIKI]}
          />
        </div>
      </div>
    );

    if (titles[activeTab] === 'Overview') {
      return <ActiveTabContent {...props} />;
    }

    return (
      <SingleTabAnalysisBanner customMessaging={customMessaging}>
        <ActiveTabContent {...props} />
      </SingleTabAnalysisBanner>
    );
  }, [activeTab, panel.Element, props, titles, updateSelectedItemKey]);

  const { extractSelectedItemKeyTitles } = useSidebar(({ actions }) => ({
    extractSelectedItemKeyTitles: actions.extractSelectedItemKeyTitles,
  }));

  return (
    <div
      data-testid="topics-content"
      className="h-screen w-full flex flex-col overflow-hidden"
    >
      <div className="p-4 flex flex-col gap-1">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">Topics</h1>
        </div>
        <Breadcrumbs items={extractSelectedItemKeyTitles()} />
      </div>
      <Tabs />
      <div
        className={classNames('overflow-auto flex-1', className)}
        style={{
          minHeight: 'calc(100% - 116px)',
        }}
      >
        {tabToBeShown}
      </div>
    </div>
  );
};

export default Panel;

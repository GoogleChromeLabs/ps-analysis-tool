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
  Tabs,
  useSidebar,
  useTabs,
} from '@google-psat/design-system';
import classNames from 'classnames';
import React from 'react';

const Panel = () => {
  const { panel } = useTabs(({ state }) => ({ panel: state.panel }));
  const ActiveTabContent = panel.Element;
  const { className, props } = panel;

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
        {ActiveTabContent && <ActiveTabContent {...props} />}
      </div>
    </div>
  );
};

export default Panel;

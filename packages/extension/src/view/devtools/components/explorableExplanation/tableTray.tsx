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
import { Tabs, useTabs } from '@google-psat/design-system';
import React from 'react';

const TableTray = () => {
  const { panel } = useTabs(({ state }) => ({ panel: state.panel }));
  const ActiveTabContent = panel.Element;
  const props = panel.props;

  return (
    <div className="w-full h-full">
      <div className="bg-sky-100 dark:bg-sky-900 h-fit pt-1.5">
        <Tabs showBottomBorder={false} fontSizeClass="text-xs" />
      </div>
      {ActiveTabContent && <ActiveTabContent {...props} />}
    </div>
  );
};

export default TableTray;

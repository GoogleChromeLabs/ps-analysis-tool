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
import React from 'react';
import { LandingPage, useTabs } from '@google-psat/design-system';

const Panel = () => {
  const { panel } = useTabs(({ state, actions }) => ({
    panel: state.panel,
    highlightTab: actions.highlightTab,
  }));

  const ActiveTabContent = panel.Element;
  const { props, className } = panel;

  return (
    <LandingPage
      title="IP Protection"
      contentPanel={
        ActiveTabContent && (
          <div className={className}>
            <ActiveTabContent {...props} />
          </div>
        )
      }
      {...props}
    />
  );
};

export default Panel;

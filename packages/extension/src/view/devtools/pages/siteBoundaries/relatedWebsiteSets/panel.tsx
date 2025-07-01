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
import { LandingPage, useTabs } from '@google-psat/design-system';
import React from 'react';

const Panel = () => {
  const { panel } = useTabs(({ state }) => ({
    panel: state.panel,
  }));

  const ActiveTabContent = panel.Element;
  const { props, className } = panel;

  return (
    <LandingPage
      title="Related Website Sets"
      contentPanel={
        ActiveTabContent && (
          <div className={className} data-testid="related-website-sets-content">
            <ActiveTabContent {...props} />
          </div>
        )
      }
      {...props}
    />
  );
};

export default Panel;

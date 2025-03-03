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
 * External dependencies
 */
import React, { useEffect, useRef } from 'react';
import { Tabs, useTabs } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import classNames from 'classnames';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies
 */
import { useAttributionReporting } from '../../../stateProviders';

const Panel = () => {
  const { panel, highlightTab } = useTabs(({ state, actions }) => ({
    panel: state.panel,
    highlightTab: actions.highlightTab,
    activeTab: state.activeTab,
  }));

  const ActiveTabContent = panel.Element;
  const { className, props } = panel;

  const { sourcesRegistration, triggerRegistration } = useAttributionReporting(
    ({ state }) => ({
      sourcesRegistration: state.sourcesRegistration,
      triggerRegistration: state.triggerRegistration,
    })
  );

  const sourcesRegistrationRef = useRef(sourcesRegistration);
  const triggerRegistrationRef = useRef(triggerRegistration);

  useEffect(() => {
    sourcesRegistrationRef.current = sourcesRegistration;
    triggerRegistrationRef.current = triggerRegistration;
  }, [sourcesRegistration, triggerRegistration]);

  useEffect(() => {
    if (!isEqual(sourcesRegistration, sourcesRegistrationRef.current)) {
      highlightTab(1);
      highlightTab(2);
    }
  }, [sourcesRegistration, highlightTab]);

  useEffect(() => {
    if (isEqual(triggerRegistration, triggerRegistrationRef.current)) {
      highlightTab(3);
    }
  }, [triggerRegistration, highlightTab]);

  return (
    <div
      data-testid="attribution-reporting-content"
      className="h-screen w-full flex flex-col overflow-hidden"
    >
      <div className="p-4">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">
            {I18n.getMessage('attributionReporting')}
          </h1>
        </div>
      </div>
      <Tabs />
      <div
        className={classNames('overflow-auto', className)}
        style={{
          minHeight: 'calc(100% - 93px)',
        }}
      >
        {ActiveTabContent && <ActiveTabContent {...props} />}
      </div>
    </div>
  );
};

export default Panel;

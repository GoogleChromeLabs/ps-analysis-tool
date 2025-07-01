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
import React, { useEffect, useRef, useMemo } from 'react';
import { LandingPage, useTabs } from '@google-psat/design-system';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies
 */
import { useAttributionReporting } from '../../../stateProviders';

const Panel = () => {
  const { panel, highlightTab } = useTabs(({ state, actions }) => ({
    panel: state.panel,
    highlightTab: actions.highlightTab,
  }));

  const ActiveTabContent = panel.Element;
  const { props, className, containerClassName } = panel;

  const { sourcesRegistration, triggerRegistration, filter } =
    useAttributionReporting(({ state }) => ({
      sourcesRegistration: state.sourcesRegistration,
      triggerRegistration: state.triggerRegistration,
      filter: state.filter,
    }));

  const sourcesRegistrationRef = useRef<typeof sourcesRegistration>([]);
  const activeRegistrationRef = useRef<typeof sourcesRegistration>([]);
  const triggerRegistrationRef = useRef<typeof triggerRegistration>([]);

  const filteredSourceRegistration = useMemo(() => {
    if (filter?.sourcesRegistration) {
      return sourcesRegistration.filter(
        (source) =>
          source.tabId &&
          source.tabId === chrome.devtools.inspectedWindow.tabId.toString()
      );
    } else {
      return sourcesRegistration;
    }
  }, [filter?.sourcesRegistration, sourcesRegistration]);

  const filteredTriggerRegistration = useMemo(() => {
    if (filter?.triggerRegistration) {
      return triggerRegistration.filter(
        (trigger) =>
          trigger.tabId &&
          trigger.tabId === chrome.devtools.inspectedWindow.tabId.toString()
      );
    } else {
      return triggerRegistration;
    }
  }, [filter?.triggerRegistration, triggerRegistration]);

  const filteredActiveSourceRegistration = useMemo(() => {
    if (filter?.activeSources) {
      return sourcesRegistration.filter(
        (source) =>
          source.tabId &&
          source.tabId === chrome.devtools.inspectedWindow.tabId.toString()
      );
    } else {
      return sourcesRegistration;
    }
  }, [filter?.activeSources, sourcesRegistration]);

  useEffect(() => {
    if (
      !isEqual(filteredActiveSourceRegistration, activeRegistrationRef.current)
    ) {
      if (!filteredActiveSourceRegistration.length) {
        highlightTab(1, false);
      } else {
        highlightTab(1);
      }

      activeRegistrationRef.current = filteredActiveSourceRegistration;
    }
  }, [filteredActiveSourceRegistration, highlightTab]);

  useEffect(() => {
    if (!isEqual(filteredSourceRegistration, sourcesRegistrationRef.current)) {
      if (!filteredSourceRegistration.length) {
        highlightTab(2, false);
      } else {
        highlightTab(2);
      }

      sourcesRegistrationRef.current = filteredSourceRegistration;
    }
  }, [filteredSourceRegistration, highlightTab]);

  useEffect(() => {
    if (!isEqual(filteredTriggerRegistration, triggerRegistrationRef.current)) {
      if (!filteredTriggerRegistration.length) {
        highlightTab(3, false);
      } else {
        highlightTab(3);
      }
      triggerRegistrationRef.current = filteredTriggerRegistration;
    }
  }, [filteredTriggerRegistration, highlightTab]);

  return (
    <LandingPage
      title="Attribution Reporting"
      contentPanel={
        ActiveTabContent && (
          <div
            className={className}
            data-testid="attribution-reporting-content"
          >
            <ActiveTabContent {...props} />
          </div>
        )
      }
      extraClasses={containerClassName}
      {...props}
    />
  );
};

export default Panel;

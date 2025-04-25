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
import { TabsProvider, type TabItems } from '@google-psat/design-system';
import type {
  SourcesRegistration,
  TriggerRegistration,
} from '@google-psat/common';
import React, { useMemo } from 'react';

/**
 * Internal dependencies
 */
import Panel from './panel';
import Difference from './difference';
import JsonView from '../jsonView';

interface JsonDisplayProps {
  currentJson: TriggerRegistration | SourcesRegistration | null;
  prevJson: TriggerRegistration | SourcesRegistration | null;
}
const JsonDisplay = ({ currentJson, prevJson }: JsonDisplayProps) => {
  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Current',
        content: {
          Element: JsonView as unknown as (props: any) => React.JSX.Element,
          props: {
            currentJson,
          },
        },
      },
      {
        title: 'Difference',
        content: {
          Element: Difference,
          props: {
            currentJson,
            prevJson,
          },
          className: 'overflow-hidden',
        },
      },
    ],
    [currentJson, prevJson]
  );
  return (
    <TabsProvider items={tabItems} name="attribution-reporting">
      <Panel />
    </TabsProvider>
  );
};

export default JsonDisplay;

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
 * External dependencies.
 */
import React from 'react';
import { SidebarProvider } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import useSidebarProcessing from './hooks/useSidebarProcessing';
import Panel from './panel';
import EvaluationEnvironment from '../evaluationEnvironment';

const Auctions = () => {
  const { sidebarData, defaultSelectedItemKey, hasData } =
    useSidebarProcessing();

  if (!hasData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-lg text-raisin-black dark:text-bright-gray">
          No ad units were recorded.
        </p>

        <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the ad units if you haven’t already." />
      </div>
    );
  }

  return (
    <SidebarProvider
      data={sidebarData}
      defaultSelectedItemKey={defaultSelectedItemKey}
    >
      <Panel />
    </SidebarProvider>
  );
};

export default Auctions;

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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import './app.css';
import {
  Cookies,
  Topics,
  Attribution,
  BounceTracking,
  Fingerprinting,
  Sidebar,
} from './components';
import { Provider as ContentPanelProvider } from './stateProviders/contentPanelStore';

const TABS = [
  {
    display_name: 'Cookies',
    Component: Cookies,
  },
  {
    display_name: 'Topics',
    Component: Topics,
  },
  {
    display_name: 'Attribution',
    Component: Attribution,
  },
  {
    display_name: 'Bounce Tracking',
    Component: BounceTracking,
  },
  {
    display_name: 'Fingerprinting',
    Component: Fingerprinting,
  },
];

const App: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const TabContent = TABS[selectedTabIndex].Component;
  const tabNames = TABS.map((tab) => tab.display_name);
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full flex flex-row">
        <Resizable
          defaultSize={{ width: '200px', height: '100%' }}
          minWidth={'150px'}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          className="h-full flex flex-col pt-3.5 border-solid border-r border-b border-gray-300"
        >
          <Sidebar
            tabsNames={tabNames}
            selectedIndex={selectedTabIndex}
            setIndex={setSelectedTabIndex}
          />
        </Resizable>
        <main className="h-full flex-1 overflow-auto">
          <ContentPanelProvider>
            <TabContent />
          </ContentPanelProvider>
        </main>
      </div>
    </div>
  );
};

export default App;

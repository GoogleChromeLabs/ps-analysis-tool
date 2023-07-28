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
  TabHeader,
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
      <div className="w-full h-full flex flex-col">
        <header className="w-full h-10 bg-slate-300 flex pt-2">
          <TabHeader
            tabsNames={tabNames}
            selectedIndex={selectedTabIndex}
            setIndex={setSelectedTabIndex}
          />
        </header>
        <main style={{ height: 'calc(100% - 40px)' }}>
          <ContentPanelProvider>
            <TabContent />
          </ContentPanelProvider>
        </main>
      </div>
    </div>
  );
};

export default App;

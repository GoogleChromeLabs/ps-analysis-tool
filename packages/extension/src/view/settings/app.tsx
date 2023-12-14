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
import TABS from './tabs';
import TabHeader from './components/tabHeader';

const App: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const TabContent = TABS[selectedTabIndex].component;

  return (
    <div className="w-full h-full flex items-center justify-center flex-col p-3">
      <TabHeader
        tabs={TABS.map((tab) => tab.display_name)}
        setSelectedTabIndex={setSelectedTabIndex}
        selectedTabIndex={selectedTabIndex}
      />
      <main className="w-full h-full flex flex-col gap-1">
        <TabContent />
      </main>
    </div>
  );
};

export default App;

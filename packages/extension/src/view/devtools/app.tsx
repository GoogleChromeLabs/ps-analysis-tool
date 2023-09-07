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
import TABS from './tabs';
import { Sidebar } from './components';

const App: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const TabContent = TABS[selectedTabIndex].component;

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black">
      <div className="w-full h-full flex flex-row">
        <Resizable
          defaultSize={{ width: '200px', height: '100%' }}
          minWidth={'150px'}
          maxWidth={'98%'}
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
          className="h-full flex flex-col pt-0.5 border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz"
        >
          <Sidebar
            selectedIndex={selectedTabIndex}
            setIndex={setSelectedTabIndex}
          />
        </Resizable>
        <main className="h-full flex-1 overflow-auto">
          <TabContent />
        </main>
      </div>
    </div>
  );
};

export default App;

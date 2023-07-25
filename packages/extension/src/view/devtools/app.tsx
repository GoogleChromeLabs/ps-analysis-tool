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
import React, { useCallback, useState } from 'react';
import { Resizable, type ResizeDirection, type NumberSize } from 're-resizable';

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
  const [width, setWidth] = useState<number>(135);
  const setWidthOnResizeStop = useCallback(
    (
      _: MouseEvent | TouchEvent,
      __: ResizeDirection,
      ___: HTMLElement,
      d: NumberSize
    ): void => {
      if (width + d.width > 0) {
        setWidth(width + d.width);
      } else {
        setWidth(135);
      }
    },
    [width]
  );

  const TabContent = TABS[selectedTabIndex].Component;
  const tabNames = TABS.map((tab) => tab.display_name);
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full flex flex-row">
        <Resizable
          minWidth={'135px'}
          size={{ width: width, height: '100%' }}
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
          onResizeStop={setWidthOnResizeStop}
          className="w-1/4 h-full px-1 flex flex-col pt-2 truncate overflow-y-auto"
        >
          <TabHeader
            tabsNames={tabNames}
            selectedIndex={selectedTabIndex}
            setIndex={setSelectedTabIndex}
          />
        </Resizable>
        <main className="w-full" style={{ height: 'calc(100% - 48px)' }}>
          <TabContent />
        </main>
      </div>
    </div>
  );
};

export default App;

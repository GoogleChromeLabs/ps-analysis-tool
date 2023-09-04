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
import React from 'react';

/**
 * Internal dependencies.
 */
interface TabHeaderProps {
  tabs: string[];
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
}
const TabHeader = ({
  tabs,
  selectedTabIndex,
  setSelectedTabIndex,
}: TabHeaderProps) => {
  return (
    <div className="w-full h-full flex flex-row gap-1">
      <ul>
        {tabs.map((tab, index) => (
          <li
            onClick={() => setSelectedTabIndex(index)}
            key={tab}
            className={`text-xl ${
              index === selectedTabIndex ? 'border-b border-color-black' : ''
            }`}
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabHeader;

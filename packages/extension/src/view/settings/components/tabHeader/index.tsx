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
      {tabs.map((tab, index) => (
        <div
          onClick={() => setSelectedTabIndex(index)}
          key={tab}
          className={`text-xl cursor-pointer px-2 border ${
            index === selectedTabIndex
              ? 'border-black border-b-white'
              : 'border-white'
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default TabHeader;

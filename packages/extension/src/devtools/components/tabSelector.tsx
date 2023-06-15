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
import React, { useState } from 'react';

/**
 * External dependencies.
 */
import { TABS, TAB_ENUM } from './tabs';

export const TabSelctor = () => {
  const [selectedTab, setSelectedTab] = useState<TAB_ENUM>(TAB_ENUM.COOKIE_TAB);
  const TabComponent = TABS[selectedTab].Component;
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-10 bg-slate-300 flex pt-2">
        {Object.keys(TAB_ENUM).map((tab) => (
          <div
            key={tab}
            className={`h-full mx-1 px-3 flex justify-ceter items-center rounded-t-lg cursor-pointer ${
              selectedTab === tab ? 'bg-slate-100' : 'bg-slate-200'
            }`}
            onClick={() => {
              setSelectedTab(tab as TAB_ENUM);
            }}
          >
            <p>{TABS[tab as TAB_ENUM].display_name}</p>
          </div>
        ))}
      </div>
      <div className="flex-1">
        <TabComponent />
      </div>
    </div>
  );
};

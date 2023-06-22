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

interface ITabSelector {
  tabs: { display_name: string; Component: () => React.JSX.Element }[];
}

export const TabSelector = ({ tabs }: ITabSelector) => {
  const [selectedTabInd, setSelectedTabInd] = useState<number>(0);

  const TabComponent = tabs[selectedTabInd].Component;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-10 bg-slate-300 flex pt-2">
        {tabs.map(({ display_name }, ind) => (
          <div
            key={display_name}
            className={`h-full mx-1 px-3 flex justify-ceter items-center rounded-t-lg cursor-pointer ${
              selectedTabInd === ind ? 'bg-slate-100' : 'bg-slate-200'
            }`}
            onClick={() => {
              setSelectedTabInd(ind);
            }}
          >
            <p>{display_name}</p>
          </div>
        ))}
      </div>
      <div style={{ height: 'calc(100% - 48px)' }}>
        <TabComponent />
      </div>
    </div>
  );
};

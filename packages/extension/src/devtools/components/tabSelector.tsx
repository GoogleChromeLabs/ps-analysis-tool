/**
 * External dependencies.
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
    <div className="w-full h-full">
      <div className="w-full h-[48px] bg-slate-300 flex pt-2">
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
      <div style={{ height: 'calc(100% - 48px)' }}>
        <TabComponent />
      </div>
    </div>
  );
};

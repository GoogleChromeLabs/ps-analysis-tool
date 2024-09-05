/*
 * Copyright 2024 Google LLC
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
import React, { useCallback } from 'react';
import { DashboardIcon, useSidebar } from '@google-psat/design-system';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { PINNED_ITEMS, FEATURE_LIST } from './constants';

const Dashboard = () => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  const handleFeatureBoxClick = useCallback(
    (event: React.MouseEvent, sidebarKey: string) => {
      const target = event.target as HTMLElement;
      if (target?.tagName !== 'BUTTON') {
        navigateTo(sidebarKey);
      }
    },
    [navigateTo]
  );

  const handleButtonClick = useCallback(
    (event: React.MouseEvent, sidebarKey: string) => {
      const target = event.target as HTMLElement;

      if (target?.tagName === 'BUTTON') {
        navigateTo(sidebarKey);
      }
    },
    [navigateTo]
  );

  return (
    <div
      data-testid="dashboard-content"
      className="h-full w-full text-raisin-black dark:text-bright-gray"
    >
      <div className="p-4 min-w-[1100px] max-w-[1200px]">
        <header className="flex items-center">
          <DashboardIcon width="22" height="22" className="mr-1.5" />
          <h1 className="text-lg">Dashboard</h1>
        </header>
        <section className="mt-5 border-b border-hex-gray mb-5 pb-5">
          <h3 className="text-sm mb-2">Pinned</h3>
          <div className="flex gap-5">
            {PINNED_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="border border-chinese-silver px-3 py-4 flex gap-2 justify-start rounded flex-1 hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                  onClick={() => navigateTo(item.sidebarKey)}
                >
                  <Icon width={20} height={20} className="fill-gray" />
                  <span className="text-sm">{item.name}</span>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <h3 className="text-sm mb-2">Features</h3>
          <div className="grid grid-cols-3 gap-5">
            {FEATURE_LIST.map((item) => {
              const Icon = item.icon;
              const headingClasses = classNames(
                'text-sm',
                item?.colorClasses?.heading ? item?.colorClasses?.heading : ''
              );

              return (
                <div
                  key={item.name}
                  className="border border-chinese-silver px-3 py-4 rounded hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                  onClick={(event) =>
                    handleFeatureBoxClick(event, item.sidebarKey)
                  }
                >
                  <div className="flex gap-2 justify-start mb-3">
                    <Icon width={20} height={20} className="fill-gray" />
                    <h4 className={headingClasses}>{item.name}</h4>
                  </div>
                  <p>{item.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                    {item.buttons &&
                      item.buttons.map((button) => (
                        <button
                          className="bg-cultured-grey text-raisin-black py-1 px-4 rounded border border-dark-grey text-xs hover:bg-light-gray hover:border-american-silver"
                          key={button.name}
                          onClick={(event) =>
                            handleButtonClick(event, button.sidebarKey)
                          }
                        >
                          {button.name}
                        </button>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

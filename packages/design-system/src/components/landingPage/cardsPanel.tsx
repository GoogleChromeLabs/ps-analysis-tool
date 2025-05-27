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
import React, { ComponentType, SVGProps } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { SIDEBAR_ITEMS_KEYS, useSidebar } from '../sidebar';

type FeatureItem = {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  sidebarKey: SIDEBAR_ITEMS_KEYS;
  url?: string;
  description: string;
  colorClasses?: {
    heading?: string;
  };
  buttons?: {
    name: string;
    sidebarKey: SIDEBAR_ITEMS_KEYS;
    url?: string;
  }[];
};

type CardsPanelProps = {
  featuredItems: FeatureItem[];
  onFeaturedButtonClick: (
    event: React.MouseEvent,
    sidebarKey: SIDEBAR_ITEMS_KEYS,
    url?: string
  ) => void;
  centered?: boolean;
};

const CardsPanel = ({
  featuredItems,
  onFeaturedButtonClick,
  centered = false,
}: CardsPanelProps) => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);
  const internalContainer = classNames(
    'flex gap-5 flex-wrap mt-2 min-w-[784px] overflow-x-hidden p-4',
    {
      'justify-center': centered,
    }
  );

  const clickHandler = (sidebarKey: string, url = '') => {
    navigateTo(sidebarKey);

    if (url) {
      chrome.tabs.update({ url });
    }
  };

  return (
    <div
      data-testid="cards-panel"
      className="text-raisin-black dark:text-bright-gray pb-14 px-4"
    >
      {featuredItems.length > 0 && (
        <div className={internalContainer}>
          {featuredItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                role="button"
                key={item.name}
                className="w-[366px] min-h-[285px] rounded border-2 border-gray-300 dark:border-quartz px-3 py-4 hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                onClick={() => clickHandler(item.sidebarKey, item?.url)}
              >
                <div className="mb-3 flex items-center flex-col gap-2">
                  <Icon height={45} />
                  <h4 className="font-medium text-xl">{item.name}</h4>
                </div>
                <p className="text-sm text-center">{item.description}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4 justify-center">
                  {item.buttons &&
                    item.buttons.map((button) => (
                      <button
                        className="bg-cultured-grey text-raisin-black py-1 px-4 rounded border border-dark-grey text-xs hover:bg-light-gray hover:border-american-silver"
                        key={button.name}
                        onClick={(event) =>
                          onFeaturedButtonClick(
                            event,
                            button.sidebarKey,
                            button?.url
                          )
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
      )}
    </div>
  );
};

export default CardsPanel;

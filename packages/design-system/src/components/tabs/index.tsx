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
 * External dependencies
 */
import classNames from 'classnames';
import React, { useCallback } from 'react';

export type TabItems = Array<{
  title: string;
  content: {
    Element: (props: any) => React.JSX.Element;
    props?: Record<string, any>;
    className?: string;
  };
}>;
interface TabsProps {
  items: TabItems;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  showBottomBorder?: boolean;
  fontSizeClass?: string;
}

const Tabs = ({
  items,
  activeTab,
  setActiveTab,
  showBottomBorder = true,
  fontSizeClass,
}: TabsProps) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (event.key === 'Tab') {
        const nextIndex = activeTab + 1;
        if (nextIndex < items.length) {
          setActiveTab(nextIndex);
        } else {
          setActiveTab(0);
        }
      }

      if (event.shiftKey && event.key === 'Tab') {
        const previousIndex = activeTab - 1;
        if (previousIndex >= 0) {
          setActiveTab(previousIndex);
        } else {
          setActiveTab(items.length - 1);
        }
      }
    },
    [activeTab, items.length, setActiveTab]
  );

  return (
    <div
      className={classNames(
        'w-full h-fit border-american-silver dark:border-quartz',
        showBottomBorder ? 'border-b' : ' border-b-0'
      )}
    >
      <div
        className={classNames(
          'flex gap-10 mx-4',
          fontSizeClass ? fontSizeClass : 'text-sm'
        )}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            onKeyDown={handleKeyDown}
            className={classNames(
              'pb-1.5 px-1.5 border-b-2 hover:opacity-80 outline-none text-nowrap',
              {
                'border-bright-navy-blue dark:border-jordy-blue text-bright-navy-blue dark:text-jordy-blue':
                  index === activeTab,
              },
              {
                'border-transparent text-raisin-black dark:text-bright-gray':
                  index !== activeTab,
              }
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;

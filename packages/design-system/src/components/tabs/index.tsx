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
import React, { useCallback, useState } from 'react';

interface TabsProps {
  items: Array<{
    title: string;
    content: {
      Element: (props: any) => React.JSX.Element;
      props?: Record<string, any>;
    };
  }>;
}

const Tabs = ({ items }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const ActiveTabContent = items?.[activeTab].content?.Element;

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
    [activeTab, items.length]
  );

  return (
    <div className="max-w-2xl h-fit px-4">
      <div className="flex gap-6 border-b border-gray-300 dark:border-quartz">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            onKeyDown={handleKeyDown}
            autoFocus={index === 0}
            className={classNames(
              'hover:opacity-80 outline-none text-raisin-black dark:text-bright-gray',
              {
                'border-b-2 border-bright-navy-blue dark:border-jordy-blue text-bright-navy-blue dark:text-jordy-blue':
                  index === activeTab,
              }
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {ActiveTabContent && (
          <ActiveTabContent {...items?.[activeTab].content?.props} />
        )}
      </div>
    </div>
  );
};

export default Tabs;

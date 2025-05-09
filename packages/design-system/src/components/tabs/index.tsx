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

/**
 * Internal dependencies
 */
import { useTabs } from './useTabs';

interface TabsProps {
  showBottomBorder?: boolean;
  fontSizeClass?: string;
}

const Tabs = ({ showBottomBorder = true, fontSizeClass }: TabsProps) => {
  const { activeTab, setActiveTab, titles, isTabHighlighted, shouldAddSpacer } =
    useTabs(({ state, actions }) => ({
      activeTab: state.activeTab,
      setActiveTab: actions.setActiveTab,
      titles: state.titles,
      isTabHighlighted: actions.isTabHighlighted,
      shouldAddSpacer: actions.shouldAddSpacer,
    }));

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (event.key === 'Tab') {
        const nextIndex = activeTab + 1;
        if (nextIndex < titles.length) {
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
          setActiveTab(titles.length - 1);
        }
      }
    },
    [activeTab, titles.length, setActiveTab]
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
          'flex gap-8 mx-4 w-full',
          fontSizeClass ? fontSizeClass : 'text-sm'
        )}
      >
        {titles.map((title, index) => {
          const addSpacer = shouldAddSpacer(index);
          const isHighlighted = isTabHighlighted(index);
          const isNumber = typeof isHighlighted === 'number';
          let count: string | number = '';

          if (isNumber) {
            count = isHighlighted > 9 ? '9+' : isHighlighted;
          }

          return (
            <React.Fragment key={index}>
              <div className="flex">
                <button
                  onClick={() => setActiveTab(index)}
                  onKeyDown={handleKeyDown}
                  className={classNames(
                    'pb-1.5 px-1.5 border-b-2 hover:opacity-80 outline-hidden text-nowrap',
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
                  {title}
                </button>
                <div
                  className={classNames(
                    'h-1.5 w-1.5 rounded-full text-center text-xxxs font-bold text-bright-gray',
                    {
                      'bg-transparent': !isHighlighted,
                    },
                    {
                      'bg-dark-blue dark:bg-celeste': isHighlighted,
                    },
                    {
                      'h-4 w-4': isNumber,
                    }
                  )}
                >
                  {count}
                </div>
              </div>
              {addSpacer && <div className="flex-1" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;

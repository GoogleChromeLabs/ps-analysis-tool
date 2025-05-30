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
import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useTabs } from './useTabs';

interface TabsProps {
  showBottomBorder?: boolean;
  fontSizeClass?: string;
}

const Tabs = ({ showBottomBorder = true, fontSizeClass }: TabsProps) => {
  const {
    activeTab,
    activeGroup,
    setActiveTab,
    groupedTitles,
    titles,
    isTabHighlighted,
    shouldAddSpacer,
  } = useTabs(({ state, actions }) => ({
    activeTab: state.activeTab,
    activeGroup: state.activeGroup,
    setActiveTab: actions.setActiveTab,
    groupedTitles: state.groupedTitles,
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

  const [groupsExpanded, setGroupsExpanded] = useState<
    Record<string, { hidden: boolean; animating: boolean }>
  >({});

  useEffect(() => {
    setGroupsExpanded(
      Object.keys(groupedTitles).reduce((groupsStore, group, index) => {
        groupsStore[group] = {
          hidden: true,
          animating: false,
        };

        if (index === 0) {
          groupsStore[group].hidden = false;
        }

        return groupsStore;
      }, {} as Record<string, { hidden: boolean; animating: boolean }>)
    );
  }, [groupedTitles]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleGroupClick = useCallback((group: string) => {
    let shouldUnhideInstantly = false;

    setGroupsExpanded((prevState) => {
      if (prevState[group]?.hidden) {
        shouldUnhideInstantly = true;
      }

      return {
        ...Object.fromEntries(
          Object.entries(prevState).map(([groupKey]) => [
            groupKey,
            { hidden: false, animating: true },
          ])
        ),
        [group]: {
          hidden: shouldUnhideInstantly ? false : prevState[group].hidden,
          animating: shouldUnhideInstantly ? false : true,
        },
      };
    });

    timeoutRef.current = setTimeout(() => {
      setGroupsExpanded((prevState) => ({
        ...Object.fromEntries(
          Object.entries(prevState).map(([groupKey]) => [
            groupKey,
            { hidden: true, animating: false },
          ])
        ),
        [group]: {
          hidden: shouldUnhideInstantly
            ? prevState[group].hidden
            : !prevState[group].hidden,
          animating: false,
        },
      }));
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={classNames(
        'w-full h-fit border-american-silver dark:border-quartz',
        showBottomBorder ? 'border-b' : ' border-b-0'
      )}
    >
      <div
        className={classNames(
          'flex gap-8 px-2 w-full overflow-x-auto',
          fontSizeClass ? fontSizeClass : 'text-sm'
        )}
      >
        {Object.entries(groupedTitles).map(([group, data]) => {
          return (
            <div
              key={group}
              data-testid={`${group}`}
              className={classNames('flex', {
                'border-b-2 border-bright-navy-blue': group === activeGroup,
                'border-b-2 border-steel-blue/50':
                  group !== activeGroup && Object.keys(data).length > 1,
                'gap-4':
                  Object.keys(data).length > 1 &&
                  !groupsExpanded[group]?.animating,
              })}
            >
              {Object.keys(data).length > 1 && (
                <button
                  className={classNames(
                    'border border-steel-blue rounded-lg flex items-center justify-center px-2 py-0.5 mb-2 font-medium text-xs hover:opacity-70 active:opacity-100 text-raisin-black outline-none',
                    {
                      'bg-steel-blue/50': group === activeGroup,
                      'bg-steel-blue/20': group !== activeGroup,
                    }
                  )}
                  onClick={() => handleGroupClick(group)}
                >
                  {group}
                </button>
              )}
              {(!groupsExpanded[group]?.hidden ||
                Object.keys(data).length === 1) && (
                <div
                  className={classNames(
                    'transition-[width] duration-300 ease-in-out',
                    groupsExpanded[group]?.animating ? 'w-0' : 'w-fit'
                  )}
                >
                  <div
                    className={classNames(
                      'flex items-center duration-200 ease-in-out',
                      {
                        'gap-2': Object.keys(data).length > 1,
                      },
                      groupsExpanded[group]?.animating
                        ? 'opacity-0 -translate-x-10'
                        : 'opacity-100 translate-x-0'
                    )}
                  >
                    {Object.values(data).map(({ title, index }) => {
                      const addSpacer = shouldAddSpacer(index);
                      const isHighlighted = isTabHighlighted(index);
                      const isNumber = typeof isHighlighted === 'number';
                      let count: string | number = '';

                      if (isNumber) {
                        count = isHighlighted > 9 ? '9+' : isHighlighted;
                      }

                      return (
                        <React.Fragment key={index}>
                          <div
                            data-testid={`tab-${index}`}
                            className={classNames(
                              'flex duration-200 ease-in-out relative',
                              {
                                ' text-bright-navy-blue dark:text-jordy-blue font-medium':
                                  index === activeTab,
                              },
                              {
                                'text-raisin-black dark:text-bright-gray':
                                  index !== activeTab,
                              }
                            )}
                          >
                            <button
                              onClick={() => setActiveTab(index)}
                              onKeyDown={handleKeyDown}
                              className="px-1.5 hover:opacity-80 outline-none text-nowrap"
                            >
                              {title}
                            </button>
                            <div
                              className={classNames(
                                'absolute right-0 top-0 h-1.5 w-1.5 rounded-full text-center text-xxxs font-bold text-bright-gray',
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;

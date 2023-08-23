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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Accordion from './accordion';
import { useCookieStore } from '../../stateProviders/syncCookieStore';
import MenuItem from './menuItem';

interface SidebarProps {
  tabsNames: string[];
  selectedIndex: number;
  setIndex: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tabsNames,
  selectedIndex,
  setIndex,
}) => {
  const { setSelectedFrame, selectedFrame, tabFrames } = useCookieStore(
    ({ state, actions }) => ({
      setSelectedFrame: actions.setSelectedFrame,
      tabFrames: state.tabFrames,
      selectedFrame: state.selectedFrame,
    })
  );
  const [accordionState, setAccordionState] = useState<boolean>(false);
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarContainerRef.current &&
        !sidebarContainerRef.current.contains(event.target as Node)
      ) {
        setIsTabFocused(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (selectedFrame && !accordionState) {
      setAccordionState(true);
    }
  }, [accordionState, selectedFrame]);

  const mainMenuTabSelector = useCallback(
    (index: number) => {
      setIndex(index);
      setSelectedFrame(null);
      setIsTabFocused(true);
    },
    [setIndex, setSelectedFrame]
  );

  const keyboardNavigator = useCallback(
    // eslint-disable-next-line complexity
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let keys: string[] = [];
      let currIndex = 0;
      if (tabFrames) {
        keys = Object.keys(tabFrames);
        currIndex = keys.findIndex((frame) => frame === selectedFrame);
      }
      switch (event.code) {
        case 'ArrowUp':
          if (accordionState) {
            if (selectedFrame) {
              if (currIndex === 0) {
                mainMenuTabSelector(0);
              } else {
                setSelectedFrame(keys[currIndex - 1]);
              }
            } else {
              if (tabsNames[selectedIndex] === 'Topics') {
                setIndex(0);
                setSelectedFrame(keys[keys.length - 1]);
              } else {
                if (selectedIndex > 0) {
                  setIndex(selectedIndex - 1);
                }
              }
            }
          } else {
            if (selectedIndex > 0) {
              setIndex(selectedIndex - 1);
            }
          }
          break;
        case 'ArrowDown':
          if (accordionState) {
            if (selectedFrame) {
              if (currIndex === keys.length - 1) {
                mainMenuTabSelector(1);
              } else {
                setSelectedFrame(keys[currIndex + 1]);
              }
            } else {
              if (selectedIndex === 0) {
                setSelectedFrame(keys[0]);
              } else if (selectedIndex < tabsNames.length - 1) {
                setIndex(selectedIndex + 1);
              }
            }
          } else {
            if (selectedIndex < tabsNames.length - 1) {
              setIndex(selectedIndex + 1);
            }
          }
          break;
        case 'ArrowLeft':
          if (accordionState) {
            if (selectedFrame) {
              mainMenuTabSelector(0);
            } else {
              setAccordionState(false);
            }
          }
          break;
        case 'ArrowRight':
          if (!accordionState) {
            setAccordionState(true);
          }
          break;
        default:
          break;
      }
    },
    [
      accordionState,
      mainMenuTabSelector,
      selectedFrame,
      selectedIndex,
      tabFrames,
      setSelectedFrame,
      setIndex,
      tabsNames,
    ]
  );

  return (
    <div className="overflow-auto h-full">
      <div ref={sidebarContainerRef}>
        {tabsNames.map((name, index: number) => (
          <div
            key={name}
            data-testid={name}
            className={classNames(
              'flex items-center cursor-default gap-y-1.5 outline-0 dark:text-bright-gray',
              selectedIndex === index &&
                name !== 'Cookies' &&
                (isTabFocused
                  ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
                  : 'bg-gainsboro dark:bg-outer-space')
            )}
            tabIndex={0}
            onKeyDown={(event) => keyboardNavigator(event)}
          >
            {name === 'Cookies' ? (
              <Accordion
                keyboardNavigator={keyboardNavigator}
                accordionState={accordionState}
                setAccordionState={setAccordionState}
                tabFrames={tabFrames}
                setSelectedFrame={setSelectedFrame}
                selectedFrame={selectedFrame}
                selectedIndex={selectedIndex}
                index={index}
                tabName={name}
                setIndex={mainMenuTabSelector}
                isTabFocused={isTabFocused}
                setIsTabFocused={setIsTabFocused}
              />
            ) : (
              <MenuItem
                handleClick={() => mainMenuTabSelector(index)}
                isActive={selectedIndex === index && isTabFocused}
                name={name}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

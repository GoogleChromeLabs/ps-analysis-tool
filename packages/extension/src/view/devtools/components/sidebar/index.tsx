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

/**
 * Internal dependencies
 */
import Accordion from './accordion';
import { useCookieStore } from '../../stateProviders/syncCookieStore';
import TABS from '../../tabs';
import AccordionChildren from './accordion/accordionChildren';
interface SidebarProps {
  selectedIndex: number;
  setIndex: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedIndex, setIndex }) => {
  const { setSelectedFrame, selectedFrame, tabFrames } = useCookieStore(
    ({ state, actions }) => ({
      setSelectedFrame: actions.setSelectedFrame,
      tabFrames: state.tabFrames,
      selectedFrame: state.selectedFrame,
    })
  );

  const [accordionState, setAccordionState] =
    useState<Record<string, boolean>>();
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  const [selectedAccordionChild, setSelectedAccordionChild] = useState<
    string | null
  >(null);
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
    setAccordionState(
      TABS.filter((tab) => Boolean(!tab.parentId)).reduce(
        (accumulator, tab) => {
          return { ...accumulator, [tab.id]: false };
        },
        {}
      )
    );

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

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
    (event: React.KeyboardEvent<HTMLDivElement>, id: string) => {
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
              if (TABS[selectedIndex].id === 'topics') {
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
          if (accordionState && accordionState['cookies']) {
            if (selectedFrame) {
              if (currIndex === keys.length - 1) {
                mainMenuTabSelector(1);
              } else {
                setSelectedFrame(keys[currIndex + 1]);
              }
            } else {
              if (selectedIndex === 0) {
                setSelectedFrame(keys[0]);
              } else if (selectedIndex < TABS.length - 1) {
                setIndex(selectedIndex + 1);
              }
            }
          } else {
            if (selectedIndex < TABS.length - 1) {
              setIndex(selectedIndex + 1);
            }
          }
          break;
        case 'ArrowLeft':
          if (accordionState && accordionState[id]) {
            if (selectedFrame) {
              mainMenuTabSelector(0);
            } else {
              setAccordionState((prevState) => ({ ...prevState, [id]: false }));
            }
          }
          break;
        case 'ArrowRight':
          if (accordionState && !accordionState[id]) {
            setAccordionState((prevState) => ({ ...prevState, [id]: true }));
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
    ]
  );

  return (
    <div className="overflow-auto h-full">
      <div ref={sidebarContainerRef}>
        {TABS.map(({ id, display_name: name, parentId }, index: number) => {
          let isAccordionHeaderSelected = false;
          if (id === 'cookies') {
            isAccordionHeaderSelected =
              selectedIndex === index && !selectedFrame;
          } else {
            isAccordionHeaderSelected =
              selectedIndex === index && !selectedAccordionChild;
          }
          return (
            <div
              key={id}
              data-testid={id}
              className="flex items-center cursor-default gap-y-1.5 outline-0 dark:text-bright-gray"
              tabIndex={0}
              onKeyDown={(event) => keyboardNavigator(event, id)}
            >
              {!parentId && (
                <Accordion
                  key={id}
                  accordionState={Boolean(accordionState && accordionState[id])}
                  index={index}
                  isAccordionHeaderSelected={isAccordionHeaderSelected}
                  isTabFocused={isTabFocused}
                  tabId={id}
                  tabName={name}
                  keyboardNavigator={keyboardNavigator}
                  onAccordionHeaderClick={() => {
                    setAccordionState((prevState) => {
                      return {
                        ...prevState,
                        [id]: prevState ? !prevState[id] : false,
                      };
                    });
                    setSelectedAccordionChild(null);
                    setSelectedFrame(null);
                  }}
                  setIndex={mainMenuTabSelector}
                >
                  {id === 'cookies'
                    ? tabFrames &&
                      Object.keys(tabFrames)?.map((key) => {
                        return (
                          <AccordionChildren
                            key={key}
                            accordionMenuItemName={key}
                            defaultIcon={TABS[index].icons.default}
                            isTabFocused={isTabFocused}
                            isAccordionChildSelected={selectedFrame === key}
                            selectedIcon={TABS[index].icons.selected}
                            onAccordionChildClick={() => {
                              if (selectedIndex !== index) {
                                setIndex(index);
                              }
                              setSelectedAccordionChild('cookies');
                              setSelectedFrame(key);
                              setIsTabFocused(true);
                            }}
                            titleForMenuItem={`Cookies used by frames from ${key}`}
                          />
                        );
                      })
                    : TABS.map((tab) => {
                        if (id === tab?.parentId) {
                          return (
                            <AccordionChildren
                              key={tab.id}
                              accordionMenuItemName={tab.display_name}
                              defaultIcon={tab.icons.default}
                              isTabFocused={isTabFocused}
                              isAccordionChildSelected={
                                tab.id === selectedAccordionChild
                              }
                              selectedIcon={tab.icons.selected}
                              titleForMenuItem={tab.display_name}
                              onAccordionChildClick={() => {
                                if (selectedIndex !== index) {
                                  setIndex(index);
                                }
                                setSelectedAccordionChild(tab.id);
                                setSelectedFrame(null);
                                setIsTabFocused(true);
                              }}
                            />
                          );
                        }
                        return <></>;
                      })}
                </Accordion>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

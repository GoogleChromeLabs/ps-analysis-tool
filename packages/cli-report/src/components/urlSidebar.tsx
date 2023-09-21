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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  CookieIcon,
  CookieIconWhite,
  Accordion,
  AccordionChildren,
} from '@cookie-analysis-tool/design-system';

const TABS = [
  {
    display_name: 'Site analysis report',
    component: () => <div></div>,
    id: 'report',
    icons: {
      default: CookieIcon,
      selected: CookieIconWhite,
    },
    parentId: undefined,
  },
];

export interface UrlSidebarProps {
  urls: string[];
  selectedIndex: number;
  setIndex: (index: number) => void;
}

const UrlSidebar = ({ urls, selectedIndex, setIndex }: UrlSidebarProps) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>();

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

  const getPreviousTab = useCallback(() => {
    for (let i = selectedIndex; i > 0; i = i - 1) {
      if (!TABS[i]?.parentId && TABS[i].id !== TABS[selectedIndex].id) {
        return i;
      }
    }
    return 0;
  }, [selectedIndex]);

  const getNextTab = useCallback(() => {
    for (let i = selectedIndex; i < TABS.length - 1; i = i + 1) {
      if (!TABS[i]?.parentId && TABS[i].id !== TABS[selectedIndex].id) {
        return i;
      }
    }
    return selectedIndex;
  }, [selectedIndex]);

  const mainMenuTabSelector = useCallback(
    (index: number) => {
      setIndex(index);
      setSelectedUrl(null);
      setSelectedAccordionChild(null);
      setIsTabFocused(true);
    },
    [setIndex, setSelectedUrl]
  );

  const keyboardNavigator = useCallback(
    // eslint-disable-next-line complexity
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let currIndex = 0;
      const id = TABS[selectedIndex].id;
      if (urls) {
        currIndex = urls.findIndex((url) => url === selectedUrl);
      }

      switch (event.code) {
        case 'ArrowUp':
          if (accordionState && accordionState['cookies']) {
            if (selectedUrl) {
              if (currIndex === 0) {
                mainMenuTabSelector(0);
              } else {
                setSelectedUrl(urls[currIndex - 1]);
              }
            } else {
              if (TABS[selectedIndex].id === 'siteBoundaries') {
                setIndex(0);
                setSelectedUrl(urls[urls.length - 1]);
              } else {
                if (selectedIndex > 0) {
                  if (
                    accordionState &&
                    (accordionState[TABS[selectedIndex].id] || //@ts-ignore We have already set the parents in useEffect
                      Boolean(accordionState[TABS[selectedIndex - 1].parentId]))
                  ) {
                    setSelectedAccordionChild(TABS[selectedIndex - 1].id);
                    setIndex(selectedIndex - 1);
                  } else {
                    setSelectedAccordionChild(null);
                    setIndex(getPreviousTab());
                  }
                }
              }
            }
          } else {
            if (selectedIndex > 0) {
              if (
                accordionState &&
                (accordionState[TABS[selectedIndex].id] || //@ts-ignore Since we are using Boolean this will default to false
                  Boolean(accordionState[TABS[selectedIndex - 1].parentId]))
              ) {
                setSelectedAccordionChild(TABS[selectedIndex - 1].id);
                setIndex(selectedIndex - 1);
              } else {
                setSelectedAccordionChild(null);
                setIndex(getPreviousTab());
              }
            }
          }
          break;
        case 'ArrowDown':
          if (accordionState && accordionState['cookies']) {
            if (selectedUrl) {
              if (currIndex === urls.length - 1) {
                mainMenuTabSelector(1);
              } else {
                setSelectedUrl(urls[currIndex + 1]);
              }
            } else {
              if (selectedIndex === 0) {
                setSelectedUrl(urls[0]);
              } else if (selectedIndex < TABS.length - 1) {
                if (
                  accordionState &&
                  (accordionState[TABS[selectedIndex].id] || //@ts-ignore Since we are using Boolean this will default to false
                    Boolean(accordionState[TABS[selectedIndex + 1].parentId]))
                ) {
                  setSelectedAccordionChild(TABS[selectedIndex + 1].id);
                  setIndex(selectedIndex + 1);
                } else {
                  setSelectedAccordionChild(null);
                  setIndex(getNextTab());
                }
              }
            }
          } else {
            if (selectedIndex < TABS.length - 1) {
              if (
                accordionState &&
                (accordionState[TABS[selectedIndex].id] || //@ts-ignore Since we are using Boolean this will default to false
                  Boolean(accordionState[TABS[selectedIndex + 1].parentId]))
              ) {
                setSelectedAccordionChild(TABS[selectedIndex + 1].id);
                setIndex(selectedIndex + 1);
              } else {
                setSelectedAccordionChild(null);
                setIndex(getNextTab());
              }
            }
          }
          break;
        case 'ArrowLeft':
          if (accordionState && accordionState[id]) {
            if (selectedUrl) {
              mainMenuTabSelector(0);
            } else {
              setAccordionState((prevState) => ({ ...prevState, [id]: false }));
            }
          }
          break;
        case 'ArrowRight':
          if (accordionState && !accordionState[id]) {
            event.preventDefault();
            setAccordionState((prevState) => ({ ...prevState, [id]: true }));
          }
          break;
        default:
          break;
      }
    },
    [
      accordionState,
      getNextTab,
      getPreviousTab,
      mainMenuTabSelector,
      selectedIndex,
      selectedUrl,
      setIndex,
      urls,
    ]
  );
  return (
    <div className="overflow-auto flex h-full">
      <div className="flex flex-col grow" ref={sidebarContainerRef}>
        {TABS.map(({ id, display_name: name, parentId }, index: number) => {
          if (!parentId) {
            return (
              <div
                key={id}
                data-testid={id}
                className="flex items-center cursor-default gap-y-1.5 outline-0 dark:text-bright-gray"
                tabIndex={0}
                onKeyDown={(event) => keyboardNavigator(event)}
              >
                {!parentId && (
                  <Accordion
                    tabs={TABS}
                    key={id}
                    accordionState={Boolean(
                      accordionState && accordionState[id]
                    )}
                    index={index}
                    isAccordionHeaderSelected={
                      selectedIndex === index && !selectedUrl
                    }
                    isTabFocused={isTabFocused}
                    tabId={id}
                    tabName={name}
                    keyboardNavigator={keyboardNavigator}
                    onAccordionOpenerClick={() => {
                      setAccordionState((prevState) => {
                        return {
                          ...prevState,
                          [id]: prevState ? !prevState[id] : false,
                        };
                      });
                      setSelectedAccordionChild(null);
                      setSelectedUrl(null);
                    }}
                    onAccordionHeaderClick={() => mainMenuTabSelector(index)}
                  >
                    {id === 'report'
                      ? urls &&
                        urls.map((url) => {
                          return (
                            <AccordionChildren
                              key={url}
                              accordionMenuItemName={url}
                              defaultIcon={TABS[index].icons.default}
                              isTabFocused={isTabFocused}
                              isAccordionChildSelected={selectedUrl === url}
                              selectedIcon={TABS[index].icons.selected}
                              onAccordionChildClick={() => {
                                if (selectedIndex !== index) {
                                  setIndex(index);
                                }
                                setSelectedAccordionChild('report');
                                setSelectedUrl(url);
                                setIsTabFocused(true);
                              }}
                              titleForMenuItem={`Report for ${url}`}
                            />
                          );
                        })
                      : TABS.map((tab, currentIndex) => {
                          if (id === tab?.parentId && Boolean(tab?.parentId)) {
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
                                  setIndex(currentIndex);
                                  setSelectedAccordionChild(tab.id);
                                  setSelectedUrl(null);
                                  setIsTabFocused(true);
                                }}
                              />
                            );
                          }
                          return null;
                        })}
                  </Accordion>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default UrlSidebar;

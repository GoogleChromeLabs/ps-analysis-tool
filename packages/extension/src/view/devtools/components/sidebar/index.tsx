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
import {
  Accordion,
  AccordionChildren,
} from '@cookie-analysis-tool/design-system';

/**
 * Internal dependencies
 */
import { useCookieStore } from '../../stateProviders/syncCookieStore';
import TABS from '../../tabs';
import {
  arrowUpHandler,
  arrowDownHandler,
  arrowLeftHandler,
} from './keyboardNavigationHandlers';
import useFrameOverlay from '../../hooks/useFrameOverlay';
interface SidebarProps {
  selectedIndex: number;
  setIndex: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedIndex, setIndex }) => {
  const {
    setSelectedFrame,
    selectedFrame,
    tabFrames,
    isCurrentTabBeingListenedTo,
    isInspecting,
    setIsInspecting,
  } = useCookieStore(({ state, actions }) => ({
    setSelectedFrame: actions.setSelectedFrame,
    tabFrames: state.tabFrames,
    selectedFrame: state.selectedFrame,
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
  }));

  const [accordionState, setAccordionState] =
    useState<Record<string, boolean>>();
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  const [selectedAccordionChild, setSelectedAccordionChild] = useState<
    string | null
  >('privacySandbox');
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  useFrameOverlay();

  useEffect(() => {
    if (isInspecting && selectedFrame) {
      setIndex(1);
      setSelectedAccordionChild('');
      setIsTabFocused(true);
    }
  }, [isInspecting, selectedFrame, setIndex]);

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
      TABS.filter((tab) => Boolean(!tab.parentId || tab.hasChildren)).reduce(
        (accumulator, tab) => {
          return {
            ...accumulator,
            [tab.id]: tab.id === 'privacySandbox' ? true : false,
          };
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
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selectedAccordionChild) {
        return;
      }
      let keys: string[] = [];
      let currIndex = 0;
      const id = selectedAccordionChild;
      if (tabFrames) {
        keys = Object.keys(tabFrames);
        currIndex = keys.findIndex((frame) => frame === selectedFrame);
      }

      switch (event.code) {
        case 'ArrowUp':
          arrowUpHandler({
            accordionState,
            currentIndex: currIndex,
            mainMenuTabSelector,
            setSelectedAccordionChild,
            selectedFrame,
            setIndex,
            setSelectedFrame,
            selectedIndex,
            keys,
          });
          break;
        case 'ArrowDown':
          arrowDownHandler({
            accordionState,
            currentIndex: currIndex,
            mainMenuTabSelector,
            setSelectedAccordionChild,
            selectedFrame,
            setIndex,
            setSelectedFrame,
            selectedIndex,
            keys,
          });
          break;
        case 'ArrowLeft':
          arrowLeftHandler({
            accordionState,
            mainMenuTabSelector,
            setSelectedAccordionChild,
            selectedFrame,
            setAccordionState,
            id,
          });
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
      selectedAccordionChild,
      tabFrames,
      selectedFrame,
      accordionState,
      mainMenuTabSelector,
      setSelectedFrame,
      selectedIndex,
      setIndex,
    ]
  );
  useEffect(() => {
    if (!isCurrentTabBeingListenedTo) {
      setAccordionState((prevState) => ({ ...prevState, cookies: false }));
    }
  }, [isCurrentTabBeingListenedTo]);

  const onAccordionHeaderClick = (tabIdToBeSet: string, index: number) => {
    mainMenuTabSelector(index);
    setSelectedAccordionChild(tabIdToBeSet);
  };

  const onAccordionOpenerClick = useCallback(
    (tabIdToBeSet: string) => {
      setAccordionState((prevState) => {
        return {
          ...prevState,
          [tabIdToBeSet]: prevState ? !prevState[tabIdToBeSet] : false,
        };
      });
      setSelectedAccordionChild(null);
      setSelectedFrame(null);
    },
    [setSelectedFrame]
  );

  const onAccordionChildClick = useCallback(
    (tabIdToBeSet: string, currentIndex: number, key?: string) => {
      setIsTabFocused(true);
      if (key) {
        setSelectedFrame(key);
      } else {
        setSelectedFrame(null);
      }
      setIndex(currentIndex);
      setSelectedAccordionChild(tabIdToBeSet);
      setIsTabFocused(true);
    },
    [setIndex, setSelectedFrame]
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
                {
                  <Accordion
                    key={id}
                    tabs={TABS}
                    accordionState={Boolean(
                      accordionState && accordionState[id]
                    )}
                    index={index}
                    isAccordionHeaderSelected={
                      selectedAccordionChild === id && !selectedFrame
                    }
                    isTabFocused={isTabFocused}
                    tabId={id}
                    tabName={name}
                    keyboardNavigator={keyboardNavigator}
                    onAccordionOpenerClick={onAccordionOpenerClick}
                    onAccordionHeaderClick={onAccordionHeaderClick}
                  >
                    {id === 'cookies'
                      ? tabFrames &&
                        Object.keys(tabFrames)?.map((key) => {
                          return (
                            <AccordionChildren
                              tabs={TABS}
                              key={key}
                              currentIndex={index}
                              accordionMenuItemName={key}
                              defaultIcon={TABS[index].icons.default}
                              isTabFocused={isTabFocused}
                              isAccordionChildSelected={selectedFrame === key}
                              selectedIcon={TABS[index].icons.selected}
                              selectedIndex={selectedIndex}
                              onAccordionChildClick={onAccordionChildClick}
                              titleForMenuItem={`Cookies used by frames from ${key}`}
                            />
                          );
                        })
                      : TABS.map((tab, currentIndex) => {
                          if (id === tab?.parentId && Boolean(tab?.parentId)) {
                            return (
                              <AccordionChildren
                                tabs={TABS}
                                currentIndex={currentIndex}
                                key={tab.id}
                                tabId={tab.id}
                                index={index}
                                keyboardNavigator={keyboardNavigator}
                                accordionState={accordionState}
                                isAccordionHeaderSelected={
                                  selectedAccordionChild === tab.id &&
                                  !selectedFrame
                                }
                                hasChildren={Boolean(tab?.hasChildren)}
                                accordionMenuItemName={tab.display_name}
                                defaultIcon={tab.icons.default}
                                isTabFocused={isTabFocused}
                                isAccordionChildSelected={
                                  tab.id === selectedAccordionChild
                                }
                                selectedAccordionChild={selectedAccordionChild}
                                selectedIndex={selectedIndex}
                                selectedIcon={tab.icons.selected}
                                selectedFrame={selectedFrame}
                                titleForMenuItem={tab.display_name}
                                tabFrames={tabFrames}
                                onAccordionChildClick={onAccordionChildClick}
                                onAccordionOpenerClick={onAccordionOpenerClick}
                                onAccordionHeaderClick={onAccordionHeaderClick}
                                setIsInspecting={setIsInspecting}
                                isInspecting={isInspecting}
                                showInspectButton={isCurrentTabBeingListenedTo}
                              />
                            );
                          }
                          return null;
                        })}
                  </Accordion>
                }
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Sidebar;

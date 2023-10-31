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
import React from 'react';
import classNames from 'classnames';
import type { TabFrames } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import Accordion, { type tabSidebar } from '.';
import { noop } from '../../utils';

interface AccordionChildrenProps {
  accordionMenuItemName: string;
  accordionState?: Record<string, boolean> | undefined;
  currentIndex?: number;
  defaultIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  hasChildren?: boolean;
  index?: number;
  isTabFocused: boolean;
  isAccordionChildSelected: boolean;
  isAccordionHeaderSelected?: boolean;
  isInspecting?: boolean;
  showInspectButton?: boolean;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAccordionChild?: string | null;
  selectedIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  selectedFrame?: string | null;
  selectedIndex?: number;
  tabFrames?: TabFrames | null;
  titleForMenuItem: string;
  tabId?: string;
  tabs?: tabSidebar[];
  width?: number;
  keyboardNavigator?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onAccordionChildClick?: (
    tabIdToBeSet: string,
    currentIndex: number,
    key?: string
  ) => void;
  onAccordionOpenerClick?: (tabIdToBeSet: string) => void;
  onAccordionHeaderClick?: (tabIdToBeSet: string, index: number) => void;
}

const AccordionChildren: React.FC<AccordionChildrenProps> = ({
  accordionMenuItemName,
  accordionState = {},
  currentIndex = 1000,
  defaultIcon,
  hasChildren = false,
  index,
  isTabFocused,
  isAccordionChildSelected,
  isAccordionHeaderSelected = false,
  isInspecting = false,
  showInspectButton = false,
  setIsInspecting = noop,
  selectedAccordionChild = null,
  selectedIcon,
  selectedFrame = null,
  selectedIndex,
  tabFrames = null,
  titleForMenuItem,
  tabId = '',
  tabs = [],
  width = 0,
  onAccordionChildClick = noop,
  keyboardNavigator = noop,
  onAccordionOpenerClick = noop,
  onAccordionHeaderClick = noop,
}) => {
  const DefaultIcon = defaultIcon;
  const SelectedIcon = selectedIcon;

  if (hasChildren) {
    return (
      <div
        key={tabId}
        data-testid={tabId}
        className="flex items-center cursor-default gap-y-1.5 outline-0 dark:text-bright-gray"
        tabIndex={0}
        onKeyDown={(event) => keyboardNavigator(event)}
      >
        <Accordion
          width={width}
          tabs={tabs}
          isRecursive
          key={tabId}
          accordionState={Boolean(accordionState && accordionState[tabId])}
          index={currentIndex}
          isAccordionHeaderSelected={isAccordionHeaderSelected}
          isTabFocused={isTabFocused}
          tabId={tabId}
          tabName={titleForMenuItem}
          keyboardNavigator={keyboardNavigator}
          onAccordionOpenerClick={onAccordionOpenerClick}
          onAccordionHeaderClick={onAccordionHeaderClick}
          setIsInspecting={setIsInspecting}
          isInspecting={isInspecting}
          showInspectButton={showInspectButton}
        >
          {tabId === 'cookies'
            ? tabFrames &&
              Object.keys(tabFrames)?.map((key) => {
                return (
                  <AccordionChildren
                    width={width}
                    tabs={tabs}
                    currentIndex={currentIndex}
                    key={key}
                    tabId="cookies"
                    accordionMenuItemName={key}
                    defaultIcon={tabs[currentIndex].icons.default}
                    isTabFocused={isTabFocused}
                    isAccordionChildSelected={selectedFrame === key}
                    selectedIcon={tabs[currentIndex].icons.selected}
                    onAccordionChildClick={onAccordionChildClick}
                    keyboardNavigator={keyboardNavigator}
                    titleForMenuItem={`Cookies used by frames from ${key}`}
                  />
                );
              })
            : tabs.map((tab, innerIndex) => {
                if (
                  tabId === tab?.parentId &&
                  Boolean(tab?.parentId) &&
                  !tab?.hasChildren
                ) {
                  return (
                    <AccordionChildren
                      width={width}
                      tabs={tabs}
                      currentIndex={innerIndex}
                      key={tab.id}
                      tabId={tab.id}
                      index={index}
                      keyboardNavigator={keyboardNavigator}
                      accordionState={accordionState}
                      isAccordionHeaderSelected={
                        selectedIndex === currentIndex && !selectedFrame
                      }
                      hasChildren={Boolean(tab?.hasChildren)}
                      accordionMenuItemName={tab.display_name}
                      selectedFrame={selectedFrame}
                      defaultIcon={tab.icons.default}
                      isTabFocused={isTabFocused}
                      isAccordionChildSelected={
                        tab.id === selectedAccordionChild
                      }
                      selectedAccordionChild={selectedAccordionChild}
                      selectedIcon={tab.icons.selected}
                      selectedIndex={selectedIndex}
                      titleForMenuItem={tab.display_name}
                      onAccordionChildClick={onAccordionChildClick}
                      onAccordionOpenerClick={onAccordionOpenerClick}
                      onAccordionHeaderClick={onAccordionHeaderClick}
                    />
                  );
                }
                return null;
              })}
        </Accordion>
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      data-testid={accordionMenuItemName}
      onClick={() =>
        onAccordionChildClick(tabId, currentIndex, accordionMenuItemName)
      }
      role="treeitem"
      className={classNames(
        'pl-12 py-0.5 h-5 flex items-center cursor-default outline-0 dark:text-bright-gray',
        isAccordionChildSelected &&
          (isTabFocused
            ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
            : 'bg-gainsboro dark:bg-outer-space')
      )}
    >
      <div className="h-4 flex items-center">
        {isAccordionChildSelected && isTabFocused ? (
          <SelectedIcon />
        ) : (
          <DefaultIcon />
        )}
      </div>
      <p className="pl-1.5 whitespace-nowrap" title={titleForMenuItem}>
        {accordionMenuItemName}
      </p>
    </div>
  );
};

export default AccordionChildren;

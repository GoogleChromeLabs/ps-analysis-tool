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
import React, { type PropsWithChildren } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { ArrowDown, ArrowDownWhite } from '../../../../../icons';
import TABS from '../../../tabs';

interface AccordionProps {
  accordionState: boolean;
  index: number;
  isCookiesTabOpen: boolean;
  isTabFocused: boolean;
  isAccordionHeaderSelected: boolean;
  tabId: string;
  tabName: string;
  keyboardNavigator: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onAccordionOpenerClick: () => void;
  onAccordionHeaderClick: () => void;
}

const Accordion = ({
  accordionState,
  children,
  index,
  isTabFocused,
  isAccordionHeaderSelected,
  tabId,
  tabName,
  keyboardNavigator,
  onAccordionOpenerClick,
  onAccordionHeaderClick,
}: PropsWithChildren<AccordionProps>) => {
  const headingContainerClass = classNames(
    'flex h-full flex-row items-center pl-[9px] py-0.5 outline-0 dark:text-bright-gray',
    isAccordionHeaderSelected &&
      (isTabFocused
        ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
        : 'bg-gainsboro dark:bg-outer-space')
  );
  const DefaultIcon = TABS[index].icons.default;
  const SelectedIcon = TABS[index].icons.selected;

  return (
    <div className="flex flex-col w-full">
      <div
        data-testid={`${tabId}-tab-heading-wrapper`}
        className={headingContainerClass}
        tabIndex={0}
        onClick={onAccordionHeaderClick}
        onKeyDown={(event) => keyboardNavigator(event)}
      >
        <div
          data-testid="accordion-opener"
          className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
            accordionState ? '' : '-rotate-90'
          }`}
          onClick={onAccordionOpenerClick}
        >
          {isAccordionHeaderSelected && isTabFocused ? (
            <ArrowDownWhite />
          ) : (
            <ArrowDown />
          )}
        </div>
        <div>
          {isAccordionHeaderSelected && isTabFocused ? (
            <SelectedIcon />
          ) : (
            <DefaultIcon />
          )}
        </div>
        <p className="pl-1.5 truncate">{tabName}</p>
      </div>
      <div
        data-testid={`${tabId}-frames-container`}
        className={`${accordionState ? 'flex flex-col' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;

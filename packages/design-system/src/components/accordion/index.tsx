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
import { ArrowDown, ArrowDownWhite } from '../../icons';
import InspectButton from '../inspectButton';
import { noop } from '../../utils';

export interface tabSidebar {
  display_name: string;
  component: (props: any) => React.JSX.Element | null;
  id: string;
  icons: {
    default: React.FC<React.SVGProps<SVGSVGElement>>;
    selected: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  parentId?: string;
  hasChildren?: boolean;
}

interface AccordionProps {
  tabs: tabSidebar[];
  accordionState: boolean;
  index: number;
  isRecursive?: boolean;
  isTabFocused: boolean;
  isAccordionHeaderSelected: boolean;
  isInspecting?: boolean;
  showInspectButton?: boolean;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
  tabId: string;
  tabName: string;
  keyboardNavigator: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onAccordionOpenerClick: (tabIdToBeSet: string) => void;
  onAccordionHeaderClick: (tabIdToBeSet: string, index: number) => void;
}

const Accordion = ({
  tabs,
  accordionState,
  children,
  index,
  isRecursive = false,
  isTabFocused,
  isAccordionHeaderSelected,
  isInspecting = false,
  showInspectButton = false,
  setIsInspecting = noop,
  tabId,
  tabName,
  keyboardNavigator,
  onAccordionOpenerClick,
  onAccordionHeaderClick,
}: PropsWithChildren<AccordionProps>) => {
  const headingContainerClass = classNames(
    'flex h-full flex-row items-center py-0.5 outline-0 dark:text-bright-gray',
    isAccordionHeaderSelected &&
      (isTabFocused
        ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
        : 'bg-gainsboro dark:bg-outer-space'),
    isRecursive ? 'pl-6' : 'pl-[9px]'
  );
  const DefaultIcon = tabs[index].icons.default;
  const SelectedIcon = tabs[index].icons.selected;

  return (
    <div className="flex flex-col w-full relative">
      {tabId === 'cookies' && showInspectButton && (
        <div className="absolute top-1 left-44">
          <InspectButton
            isInspecting={isInspecting}
            setIsInspecting={setIsInspecting}
            isTabFocused={isAccordionHeaderSelected && isTabFocused}
          />
        </div>
      )}
      <div
        data-testid={`${tabId}-tab-heading-wrapper`}
        className={headingContainerClass}
        tabIndex={0}
        onClick={() => onAccordionHeaderClick(tabId, index)}
        onKeyDown={(event) => keyboardNavigator(event)}
      >
        <div
          data-testid={`${tabId}-accordion-opener`}
          className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
            accordionState ? '' : '-rotate-90'
          } ${children?.filter(Boolean)?.length ? '' : 'invisible'}`}
          onClick={() => onAccordionOpenerClick(tabId)}
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

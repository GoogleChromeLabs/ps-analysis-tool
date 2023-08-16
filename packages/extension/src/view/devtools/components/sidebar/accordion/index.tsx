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
import React, { useCallback } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import {
  ArrowDown,
  CookieGray,
  CookieWhite,
  ArrowDownWhite,
} from '../../../../../icons';

interface AccordionProps {
  accordionState: boolean;
  keyboardNavigator: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  setAccordionState: (state: boolean) => void;
  tabName: string;
  index: number;
  selectedIndex: number;
  tabFrames: {
    [key: string]: {
      frameIds: number[];
    };
  } | null;
  setSelectedFrame: (state: string | null) => void;
  selectedFrame: string | null;
  setIndex: (state: number) => void;
  isTabFocused: boolean;
  setIsTabFocused: (state: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  keyboardNavigator,
  accordionState,
  setAccordionState,
  tabName,
  index,
  selectedIndex,
  tabFrames,
  setSelectedFrame,
  selectedFrame,
  setIndex,
  isTabFocused,
  setIsTabFocused,
}) => {
  const subMenuSelected = useCallback(() => {
    setAccordionState(!accordionState);
    setSelectedFrame(null);
  }, [accordionState, setAccordionState, setSelectedFrame]);

  return (
    <div className="flex flex-col w-screen">
      <div
        data-testid="cookies-tab-heading-wrapper"
        className={classNames(
          'flex h-full flex-row items-center pl-3 py-0.5 outline-0 dark:text-bright-gray',
          selectedIndex === index &&
            !selectedFrame &&
            (isTabFocused
              ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
              : 'bg-gainsboro dark:bg-outer-space')
        )}
        tabIndex={0}
        onClick={() => setIndex(index)}
        onKeyDown={(event) => keyboardNavigator(event)}
      >
        <div
          data-testid="accordion-opener"
          className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
            accordionState ? '' : '-rotate-90'
          }`}
          onClick={subMenuSelected}
        >
          {selectedIndex === index && !selectedFrame && isTabFocused ? (
            <ArrowDownWhite />
          ) : (
            <ArrowDown />
          )}
        </div>
        <div>
          {selectedIndex === index && !selectedFrame && isTabFocused ? (
            <CookieWhite />
          ) : (
            <CookieGray />
          )}
        </div>
        <p className="pl-1.5 truncate">{tabName}</p>
      </div>
      <div
        data-testid="cookie-frames-container"
        className={`${accordionState ? 'flex flex-col' : 'hidden'}`}
      >
        {tabFrames &&
          Object.keys(tabFrames)?.map((key) => (
            <div
              tabIndex={0}
              data-testid={key}
              key={key}
              onClick={() => {
                if (selectedIndex !== index) {
                  setIndex(index);
                }
                setSelectedFrame(key);
                setIsTabFocused(true);
              }}
              role="treeitem"
              className={classNames(
                'pl-9 py-0.5 h-5 flex items-center cursor-default outline-0 dark:text-bright-gray',
                selectedFrame === key &&
                  (isTabFocused
                    ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
                    : 'bg-gainsboro dark:bg-outer-space')
              )}
            >
              <div className="h-4">
                {selectedFrame === key && isTabFocused ? (
                  <CookieWhite />
                ) : (
                  <CookieGray />
                )}
              </div>
              <p
                className="pl-1.5 whitespace-nowrap"
                title={`Cookies used by frames from ${key}`}
              >
                {key}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Accordion;

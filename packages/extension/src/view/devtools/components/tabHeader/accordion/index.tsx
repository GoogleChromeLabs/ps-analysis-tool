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
/**
 * Internal dependencies
 */
import {
  ArrowRight,
  ArrowDown,
  CookieGray,
  CookieWhite,
  ArrowDownWhite,
  ArrowRightWhite,
} from '../../../../../icons';

interface AccordionProps {
  accordionState: boolean;
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
}

const Accordion: React.FC<AccordionProps> = ({
  accordionState,
  setAccordionState,
  tabName,
  index,
  selectedIndex,
  tabFrames,
  setSelectedFrame,
  selectedFrame,
  setIndex,
}) => {
  const subMenuSelected = useCallback(() => {
    setAccordionState(!accordionState);
    setSelectedFrame(null);
  }, [
    accordionState,
    setAccordionState,
    setSelectedFrame,
    index,
    selectedIndex,
    setIndex,
  ]);

  return (
    <div className="flex flex-col w-full">
      <div
        data-testid="cookies-tab-heading-wrapper"
        className={`flex h-full flex-row items-center pl-4 py-0.5 ${
          selectedIndex === index && !selectedFrame
            ? 'bg-selected-background-color text-white'
            : ''
        }`}
        onClick={() => setIndex(index)}
      >
        <div onClick={subMenuSelected}>
          {accordionState ? (
            selectedIndex === index && !selectedFrame ? (
              <ArrowDownWhite />
            ) : (
              <ArrowDown />
            )
          ) : selectedIndex === index && !selectedFrame ? (
            <ArrowRightWhite />
          ) : (
            <ArrowRight />
          )}
        </div>
        <div className="pl-1">
          {selectedIndex === index && !selectedFrame ? (
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
              data-testid={key}
              key={key}
              onClick={() => {
                if (selectedIndex !== index) {
                  setIndex(index);
                }
                setSelectedFrame(key);
              }}
              className={`pl-9 py-0.5 h-5 flex items-center cursor-pointer ${
                selectedFrame === key
                  ? 'bg-selected-background-color text-white'
                  : ''
              }`}
            >
              <div className="h-4">
                {selectedFrame === key ? <CookieWhite /> : <CookieGray />}
              </div>
              <p className="pl-1.5 truncate">{key}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Accordion;

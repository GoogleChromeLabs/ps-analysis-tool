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
/**
 * Internal dependencies
 */
import { ArrowRight, ArrowDown, CookieGray } from '../../../../../icons';
import { useCookieStore } from '../../../stateProviders/syncCookieStore';

interface TabHeaderProps {
  accordionState: boolean;
  setAccordionState: (state: boolean) => void;
  tabName: string;
  index: number;
  selectedIndex: number;
}

const Accordion: React.FC<TabHeaderProps> = ({
  accordionState,
  setAccordionState,
  tabName,
  index,
  selectedIndex,
}) => {
  const { tabFrames, setSelectedFrame, selectedFrame } = useCookieStore(
    ({ state, actions }) => ({
      tabFrames: state.tabFrames,
      setSelectedFrame: actions.setSelectedFrame,
      selectedFrame: state.selectedFrame,
    })
  );

  return (
    <div className="flex flex-col my-1 w-full">
      <span
        className={`flex flex-row items-center pl-1 ${
          selectedIndex === index && !selectedFrame ? 'bg-[#3971e0]' : ''
        }`}
        onClick={() => {
          setAccordionState(!accordionState);
          setSelectedFrame(null);
        }}
      >
        {accordionState ? <ArrowDown /> : <ArrowRight />}
        <span className="flex items-center pl-1">
          <CookieGray />
          {tabName}
        </span>
      </span>
      <div
        className={`${accordionState ? 'flex flex-col ml-[32px]' : 'hidden'}`}
      >
        {tabFrames &&
          Object.keys(tabFrames)?.map((key) => (
            <div
              key={key}
              onClick={() => setSelectedFrame(key)}
              className={`mx-1 my-1 flex items-center cursor-pointer ${
                selectedFrame === key ? 'bg-[#3971e0]' : ''
              }`}
            >
              <CookieGray />
              <p className="truncate">{key}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Accordion;

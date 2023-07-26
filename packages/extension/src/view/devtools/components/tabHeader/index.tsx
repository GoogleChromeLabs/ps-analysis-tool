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
import React, { useState } from 'react';
import Accordion from './accordion';
import { File, FileWhite } from '../../../../icons';

interface TabHeaderProps {
  tabsNames: string[];
  selectedIndex: number;
  setIndex: (index: number) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({
  tabsNames,
  selectedIndex,
  setIndex,
}) => {
  const [accordionState, setAccordionState] = useState(false);
  return (
    <>
      {tabsNames.map((name, index: number) => (
        <div
          key={name}
          className={`flex items-center cursor-pointer ${
            selectedIndex === index && name !== 'Cookies'
              ? 'bg-[#3871E0] text-white'
              : ''
          }`}
          onClick={() => setIndex(index)}
        >
          {name === 'Cookies' ? (
            <Accordion
              selectedIndex={selectedIndex}
              index={index}
              tabName={name}
              accordionState={accordionState}
              setAccordionState={setAccordionState}
            />
          ) : (
            <span className="flex items-center pl-[24px]">
              {selectedIndex === index ? <FileWhite /> : <File />}
              <span className="pl-[10px]">{name}</span>
            </span>
          )}
        </div>
      ))}
    </>
  );
};

export default TabHeader;

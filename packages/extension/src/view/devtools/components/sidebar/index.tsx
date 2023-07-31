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
import Accordion from './accordion';
import { File, FileWhite } from '../../../../icons';
import { useCookieStore } from '../../stateProviders/syncCookieStore';

interface SidebarProps {
  tabsNames: string[];
  selectedIndex: number;
  setIndex: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  tabsNames,
  selectedIndex,
  setIndex,
}) => {
  const { setSelectedFrame, selectedFrame, tabFrames } = useCookieStore(
    ({ state, actions }) => ({
      setSelectedFrame: actions.setSelectedFrame,
      tabFrames: state.tabFrames,
      selectedFrame: state.selectedFrame,
    })
  );

  const mainMenuTabSelector = useCallback(
    (index: number) => {
      setIndex(index);
      setSelectedFrame(null);
    },
    [setIndex, setSelectedFrame]
  );

  return (
    <>
      {tabsNames.map((name, index: number) => (
        <div
          key={name}
          data-testid={name}
          className={`flex items-center cursor-pointer gap-y-1.5 ${
            selectedIndex === index && name !== 'Cookies'
              ? 'bg-selected-background-color text-white'
              : ''
          }`}
        >
          {name === 'Cookies' ? (
            <Accordion
              tabFrames={tabFrames}
              setSelectedFrame={setSelectedFrame}
              selectedFrame={selectedFrame}
              selectedIndex={selectedIndex}
              index={index}
              tabName={name}
              setIndex={mainMenuTabSelector}
            />
          ) : (
            <div
              className="flex items-center pl-6 py-0.5"
              onClick={() => mainMenuTabSelector(index)}
            >
              <div className="h-4">
                {selectedIndex === index ? <FileWhite /> : <File />}
              </div>
              <span className="pl-2.5">{name}</span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Sidebar;

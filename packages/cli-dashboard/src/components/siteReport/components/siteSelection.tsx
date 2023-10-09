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
import {
  ArrowDown,
  ArrowDownWhite,
  File,
  FileWhite,
} from '@cookie-analysis-tool/design-system';
import React, { useState } from 'react';

interface SiteSelectionProps {
  sites: string[];
  selectedSite: string | null;
  setSelectedSite: (site: string | null) => void;
  isSelectedTopLevelMenu: boolean;
  selectTopLevelMenu: () => void;
}

const SiteSelection = ({
  sites,
  selectedSite,
  setSelectedSite,
  isSelectedTopLevelMenu,
  selectTopLevelMenu,
}: SiteSelectionProps) => {
  const isSiteSelected = Boolean(selectedSite);
  const [isOpen, setIsOpen] = useState(isSiteSelected);
  return (
    <div className="w-full h-full overflow-auto text-sm">
      <div
        onClick={() => {
          setSelectedSite(null);
          selectTopLevelMenu();
        }}
        className={`w-full flex items-center pl-6 py-0.5 outline-0 ${
          isSelectedTopLevelMenu
            ? isSiteSelected
              ? 'bg-gainsboro'
              : 'bg-royal-blue text-white'
            : 'bg-white'
        } cursor-pointer`}
      >
        <div
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
            !isOpen && '-rotate-90'
          }`}
        >
          {isSiteSelected || !isSelectedTopLevelMenu ? (
            <ArrowDown />
          ) : (
            <ArrowDownWhite />
          )}
        </div>
        <p>Sitemap Report</p>
      </div>
      {isOpen && (
        <ul>
          {sites.map((site, id) => (
            <li
              onClick={() => {
                setSelectedSite(site);
                selectTopLevelMenu();
              }}
              className={`truncate pl-12 cursor-pointer flex items-center ${
                site === selectedSite ? 'bg-royal-blue text-white' : ''
              }`}
              key={id}
            >
              <span>{site === selectedSite ? <FileWhite /> : <File />}</span>
              <span className="pl-1.5">{site}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SiteSelection;

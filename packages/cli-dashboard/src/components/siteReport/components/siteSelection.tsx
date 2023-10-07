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
import { ArrowDownWhite } from '@cookie-analysis-tool/design-system';
import React, { useState } from 'react';

interface SiteSelectionProps {
  sites: string[];
  selectedSite: string | null;
  setSelectedSite: (site: string | null) => void;
}

const SiteSelection = ({
  sites,
  selectedSite,
  setSelectedSite,
}: SiteSelectionProps) => {
  const isSiteSelected = Boolean(selectedSite);
  const [isOpen, setIsOpen] = useState(isSiteSelected);
  return (
    <div className="w-full h-full overflow-auto">
      <div
        onClick={() => setSelectedSite(null)}
        className={`w-full flex items-center pl-6 py-0.5 outline-0 ${
          isSiteSelected ? 'bg-gainsboro' : 'bg-royal-blue text-white'
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
          <ArrowDownWhite />
        </div>
        <p>Sitemap report</p>
      </div>
      {isOpen && (
        <ul className="pl-6">
          {sites.map((site, id) => (
            <li
              onClick={() => {
                setSelectedSite(site);
              }}
              className={`truncate pl-6 cursor-pointer ${
                site === selectedSite ? 'bg-royal-blue text-white' : ''
              }`}
              key={id}
            >
              {site}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SiteSelection;

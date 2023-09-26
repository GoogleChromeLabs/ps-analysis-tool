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
import React, { useEffect } from 'react';

/**
 * Internal dependencies.
 */
import type { CountrySiteType } from '../types';
import type { SitePayloadType } from '../useGeneratorForm/types';
import { AddButton, RWSInput, RWSSelect, RemoveButton } from '../components';

interface CountrySitesProps {
  countrySites: CountrySiteType[];
  availableSites: string[];
  addCountrySite: () => void;
  removeCountrySite: (idx: number) => void;
  setCountrySites: (value: SitePayloadType) => void;
  validationFailed: boolean;
}

const CountrySites = ({
  countrySites,
  availableSites,
  addCountrySite,
  removeCountrySite,
  setCountrySites,
  validationFailed: formValidationFailed,
}: CountrySitesProps) => {
  useEffect(() => {
    const siteDiff = countrySites.map((countrySite) => {
      if (countrySite.site && !availableSites.includes(countrySite.site)) {
        return true;
      }
      return false;
    });

    if (siteDiff.includes(true)) {
      const idx = siteDiff.indexOf(true);
      setCountrySites({
        idx,
        key: 'site',
        value: '',
      });
    }
  }, [availableSites, countrySites, setCountrySites]);

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-base">
          Country Code Top-level Domains <span>(ccTLDs)</span>
        </p>
        <AddButton onClick={addCountrySite} />
      </div>
      <div id="countryDomains">
        {countrySites.map(({ site, cctld, siteError, cctldError }, idx) => (
          <div key={idx} className="flex gap-10 my-5">
            <div className="flex-1">
              <RWSSelect
                selectLabel="For which site is this ccTLD?"
                selectValue={site}
                selectChangeHandler={(e) => {
                  setCountrySites({ idx, key: 'site', value: e.target.value });
                }}
                defaultOption="Select a site"
                options={availableSites}
                error={siteError}
                formValidationFailed={formValidationFailed}
              />
            </div>
            <div className="flex-1">
              <RWSInput
                inputLabel={`ccTLD #${idx + 1}`}
                inputValue={cctld}
                inputPlaceholder="https://cctld.com"
                inputChangeHandler={(e) => {
                  setCountrySites({ idx, key: 'cctld', value: e.target.value });
                }}
                error={cctldError}
                formValidationFailed={formValidationFailed}
              />
              <span>Country code top-level domain related to the site</span>
            </div>
            <div className="flex items-center">
              <RemoveButton onClick={() => removeCountrySite(idx)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountrySites;

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
import { I18n } from '@google-psat/i18n';

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
        <p className="text-base">{I18n.getMessage('countryCodeHeading')}</p>
        <AddButton onClick={addCountrySite} />
      </div>
      <div id="countryDomains">
        {countrySites.map(({ site, cctld, siteError, cctldError }, idx) => (
          <div key={idx} className="flex gap-10 my-5">
            <div className="flex-1">
              <RWSSelect
                selectLabel={I18n.getMessage('whichSiteccTLD')}
                selectValue={site}
                selectChangeHandler={(e) => {
                  setCountrySites({ idx, key: 'site', value: e.target.value });
                }}
                defaultOption={I18n.getMessage('selectSite')}
                options={availableSites}
                error={siteError}
                formValidationFailed={formValidationFailed}
              />
            </div>
            <div className="flex-1">
              <RWSInput
                inputLabel={I18n.getMessage('extccTLDIdx', [
                  (idx + 1).toString(),
                ])}
                inputValue={cctld}
                inputPlaceholder="https://cctld.com"
                inputChangeHandler={(e) => {
                  setCountrySites({ idx, key: 'cctld', value: e.target.value });
                }}
                error={cctldError}
                formValidationFailed={formValidationFailed}
              />
              <span>{I18n.getMessage('countryCodeNote')}</span>
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

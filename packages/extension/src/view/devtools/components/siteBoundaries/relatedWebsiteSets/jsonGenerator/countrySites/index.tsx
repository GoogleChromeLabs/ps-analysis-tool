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
import React, { useCallback, useEffect } from 'react';

/**
 * Internal dependencies.
 */
import type { CountrySiteType } from '../types';
import { validateUrl } from '../utils';
import { RWSInput, RWSSelect } from '../components';
import { Button } from '../../../../../../design-system/components';

interface CountrySitesProps {
  countrySites: CountrySiteType[];
  setCountrySites: (
    prev: (prev: CountrySiteType[]) => CountrySiteType[]
  ) => void;
  availableSites: string[];
  validationFailed: boolean;
}

const CountrySites = ({
  countrySites,
  setCountrySites,
  availableSites,
  validationFailed: errorOccured,
}: CountrySitesProps) => {
  const updateCountrySites = useCallback(
    (idx: number, key: string, value: string) => {
      value = value.trim();

      setCountrySites((prev) => {
        const newCountrySites = [...prev];
        if (key === 'site') {
          newCountrySites[idx].site = value;
          newCountrySites[idx].siteError = validateUrl(value);
        }

        if (key === 'cctld') {
          newCountrySites[idx].cctld = value;
          newCountrySites[idx].cctldError = validateUrl(value);
        }

        return newCountrySites;
      });
    },
    [setCountrySites]
  );

  const addCountrySite = useCallback(() => {
    setCountrySites((prev) => [
      ...prev,
      {
        site: '',
        cctld: '',
        siteError: "Url can't be blank",
        cctldError: "Url can't be blank",
      },
    ]);
  }, [setCountrySites]);

  useEffect(() => {
    const siteDiff = countrySites.map((countrySite) => {
      if (countrySite.site && !availableSites.includes(countrySite.site)) {
        return true;
      }
      return false;
    });

    if (siteDiff.includes(true)) {
      setCountrySites((prev) => {
        const newCountrySites = [...prev];
        newCountrySites.forEach((countrySite, idx) => {
          if (siteDiff[idx]) {
            countrySite.site = '';
            countrySite.siteError = "Url can't be blank";
          }
        });
        return newCountrySites;
      });
    }
  }, [availableSites, countrySites, setCountrySites]);

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-base">
          Country Code Top-level Domains <span>(ccTLDs)</span>
        </p>
        <Button text="Add" onClick={addCountrySite} />
      </div>
      <div id="countryDomains">
        {countrySites.map(({ site, cctld, siteError, cctldError }, idx) => (
          <div key={idx} className="flex gap-10 my-3">
            <div className="flex-1">
              <RWSSelect
                selectLabel="For which site is this ccTLD?"
                selectValue={site}
                selectChangeHandler={(e) => {
                  updateCountrySites(idx, 'site', e.target.value);
                }}
                defaultOption="Select a site"
                options={availableSites}
                error={siteError}
                errorOccured={errorOccured}
              />
            </div>
            <div className="flex-1">
              <RWSInput
                inputLabel={`ccTLD #${idx + 1}`}
                inputValue={cctld}
                inputPlaceholder="https://cctld.com"
                inputChangeHandler={(e) => {
                  updateCountrySites(idx, 'cctld', e.target.value);
                }}
                error={cctldError}
                errorOccured={errorOccured}
              />
              <span>Country code top-level domain related to the site</span>
            </div>
            <div className="flex items-center">
              <Button
                text="Remove"
                type="button"
                variant="danger"
                onClick={() => {
                  setCountrySites((prev) => prev.filter((_, i) => i !== idx));
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountrySites;

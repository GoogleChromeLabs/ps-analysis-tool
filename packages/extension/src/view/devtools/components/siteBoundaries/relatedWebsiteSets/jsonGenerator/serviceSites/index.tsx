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
 * Internal dependencies.
 */
import type { ServiceSiteType } from '../types';
import { validateRationale, validateUrl } from '../utils';
import { RWSInput } from '../components';
import { Button } from '../../../../../../design-system/components';
import { Add, Cross } from '../../../../../../../icons';

interface ServiceSitesProps {
  serviceSites: ServiceSiteType[];
  setServiceSites: (
    prev: (prev: ServiceSiteType[]) => ServiceSiteType[]
  ) => void;
  validationFailed: boolean;
}

const ServiceSites = ({
  serviceSites,
  setServiceSites,
  validationFailed: errorOccured,
}: ServiceSitesProps) => {
  const updateServiceSites = useCallback(
    (idx: number, key: string, value: string) => {
      setServiceSites((prev) => {
        const newServiceSites = [...prev];
        if (key === 'url') {
          value = value.trim();

          newServiceSites[idx].url = value;
          newServiceSites[idx].urlError = validateUrl(value);
        }

        if (key === 'rationale') {
          newServiceSites[idx].rationale = value;
          newServiceSites[idx].rationaleError = validateRationale(value);
        }

        return newServiceSites;
      });
    },
    [setServiceSites]
  );

  const addServiceSite = useCallback(() => {
    setServiceSites((prev) => [
      ...prev,
      {
        url: '',
        rationale: '',
        urlError: "Url can't be blank",
        rationaleError: "Rationale can't be blank",
      },
    ]);
  }, [setServiceSites]);

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-base">Service Subset</p>
        <Button text={<Add />} onClick={addServiceSite} variant="secondary" />
      </div>
      <div id="serviceDomains">
        {serviceSites.map(
          ({ url, rationale, urlError, rationaleError }, idx) => (
            <div key={idx} className="flex gap-10 my-3">
              <div className="flex-1">
                <RWSInput
                  inputLabel={`Service Domain #${idx + 1}`}
                  inputPlaceholder="https://service.com"
                  inputValue={url}
                  inputChangeHandler={(e) => {
                    updateServiceSites(idx, 'url', e.target.value);
                  }}
                  error={urlError}
                  errorOccured={errorOccured}
                />
              </div>
              <div className="flex-1">
                <RWSInput
                  inputLabel={`Rationale Domain #${idx + 1}`}
                  inputPlaceholder="Connected to the primary domain because..."
                  inputValue={rationale}
                  inputChangeHandler={(e) => {
                    updateServiceSites(idx, 'rationale', e.target.value);
                  }}
                  error={rationaleError}
                  errorOccured={errorOccured}
                />
                <span>
                  How is the affiliation across domains presented and why users
                  would expect it
                </span>
              </div>
              <div className="flex items-center">
                <Button
                  text={<Cross />}
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setServiceSites((prev) => prev.filter((_, i) => i !== idx));
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ServiceSites;

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
import type { AssociatedSiteType } from '../types';
import { InfoIcon } from '../../../../../../../icons';
import { validateRationale, validateUrl } from '../utils';
import { RWSInput } from '../components';
import { Button } from '../../../../../../design-system/components';

interface AssociatedSitesProps {
  associatedSites: AssociatedSiteType[];
  setAssociatedSites: (
    prev: (prev: AssociatedSiteType[]) => AssociatedSiteType[]
  ) => void;
  validationFailed: boolean;
}

const AssociatedSites = ({
  associatedSites,
  setAssociatedSites,
  validationFailed: errorOccured,
}: AssociatedSitesProps) => {
  const updateAssociatedSites = useCallback(
    (idx: number, key: string, value: string) => {
      setAssociatedSites((prev) => {
        const newAssociatedSites = [...prev];
        if (key === 'url') {
          value = value.trim();

          newAssociatedSites[idx].url = value;
          newAssociatedSites[idx].urlError = validateUrl(value);
        }

        if (key === 'rationale') {
          newAssociatedSites[idx].rationale = value;
          newAssociatedSites[idx].rationaleError = validateRationale(value);
        }

        return newAssociatedSites;
      });
    },
    [setAssociatedSites]
  );

  const addAssociatedSite = useCallback(() => {
    setAssociatedSites((prev) => [
      ...prev,
      {
        url: '',
        rationale: '',
        urlError: "Url can't be blank",
        rationaleError: "Rationale can't be blank",
      },
    ]);
  }, [setAssociatedSites]);

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-base flex items-center gap-2 ">
          Associated Subset
          <span title="Browsers may enforce a limit of Associated Domains (e.g. Chrome's limit is 5)">
            <InfoIcon />
          </span>
        </p>
        <Button text="Add" type="button" onClick={addAssociatedSite} />
      </div>
      <div id="associatedDomains">
        {associatedSites.map(
          ({ url, rationale, urlError, rationaleError }, idx) => (
            <div key={idx} className="flex gap-10 my-3">
              <div className="flex-1">
                <RWSInput
                  inputLabel={`Associated Domain #${idx + 1}`}
                  inputValue={url}
                  inputPlaceholder="https://associated.com"
                  inputChangeHandler={(e) => {
                    updateAssociatedSites(idx, 'url', e.target.value);
                  }}
                  error={urlError}
                  errorOccured={errorOccured}
                />
              </div>
              <div className="flex-1">
                <RWSInput
                  inputLabel={`Rationale Domain #${idx + 1}`}
                  inputValue={rationale}
                  inputPlaceholder="Connected to the primary domain because..."
                  inputChangeHandler={(e) => {
                    updateAssociatedSites(idx, 'rationale', e.target.value);
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
                  text="Remove"
                  type="button"
                  variant="danger"
                  onClick={() => {
                    setAssociatedSites((prev) => {
                      return prev.filter((_, i) => i !== idx);
                    });
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

export default AssociatedSites;

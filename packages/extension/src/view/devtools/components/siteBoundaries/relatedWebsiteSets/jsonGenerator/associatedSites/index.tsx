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
import { InfoIcon } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import type { AssociatedSiteType } from '../types';
import { RWSInput, AddButton, RemoveButton } from '../components';
import type { SitePayloadType } from '../useGeneratorForm/types';

interface AssociatedSitesProps {
  associatedSites: AssociatedSiteType[];
  addAssociatedSite: () => void;
  removeAssociatedSite: (idx: number) => void;
  setAssociatedSites: (value: SitePayloadType) => void;
  validationFailed: boolean;
}

const AssociatedSites = ({
  associatedSites,
  addAssociatedSite,
  removeAssociatedSite,
  setAssociatedSites,
  validationFailed: formValidationFailed,
}: AssociatedSitesProps) => {
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-base flex items-center gap-2 ">
          Associated Subset
          <span title="Browsers may enforce a limit on Associated Domains (e.g. Chrome's limit is 5)">
            <InfoIcon />
          </span>
        </p>
        <AddButton onClick={addAssociatedSite} />
      </div>
      <div id="associatedDomains">
        {associatedSites.map(
          ({ url, rationale, urlError, rationaleError }, idx) => (
            <div key={idx} className="flex gap-10 my-5">
              <div className="flex-1">
                <RWSInput
                  inputLabel={`Associated Domain #${idx + 1}`}
                  inputValue={url}
                  inputPlaceholder="https://associated.com"
                  inputChangeHandler={(e) => {
                    setAssociatedSites({
                      idx,
                      key: 'url',
                      value: e.target.value,
                    });
                  }}
                  error={urlError}
                  formValidationFailed={formValidationFailed}
                />
              </div>
              <div className="flex-1">
                <RWSInput
                  inputLabel={`Rationale Domain #${idx + 1}`}
                  inputValue={rationale}
                  inputPlaceholder="Affiliation to primary domain"
                  inputChangeHandler={(e) => {
                    setAssociatedSites({
                      idx,
                      key: 'rationale',
                      value: e.target.value,
                    });
                  }}
                  error={rationaleError}
                  formValidationFailed={formValidationFailed}
                />
                <span>
                  How is the affiliation across domains presented and why users
                  would expect it
                </span>
              </div>
              <div className="flex items-center">
                <RemoveButton onClick={() => removeAssociatedSite(idx)} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AssociatedSites;

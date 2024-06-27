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
import { InfoIcon } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

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
          {I18n.getMessage('associatedSubset')}
          <span title={I18n.getMessage('associatedDomainsLimit')}>
            <InfoIcon className="fill-granite-gray" />
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
                  inputLabel={I18n.getMessage('associatedDomainIdx', [
                    (idx + 1).toString(),
                  ])}
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
                  inputLabel={I18n.getMessage('rationaleDomainCount', [
                    (idx + 1).toString(),
                  ])}
                  inputValue={rationale}
                  inputPlaceholder={I18n.getMessage('affiliationHeading')}
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
                <span>{I18n.getMessage('affiliationNote')}</span>
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

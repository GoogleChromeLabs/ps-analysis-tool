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
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import type { ServiceSiteType } from '../types';
import type { SitePayloadType } from '../useGeneratorForm/types';
import { AddButton, RWSInput, RemoveButton } from '../components';

interface ServiceSitesProps {
  serviceSites: ServiceSiteType[];
  addServiceSite: () => void;
  removeServiceSite: (idx: number) => void;
  setServiceSites: (value: SitePayloadType) => void;
  validationFailed: boolean;
}

const ServiceSites = ({
  serviceSites,
  addServiceSite,
  removeServiceSite,
  setServiceSites,
  validationFailed: formValidationFailed,
}: ServiceSitesProps) => {
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-base">{I18n.getMessage('serviceSubset')}</p>
        <AddButton onClick={addServiceSite} />
      </div>
      <div id="serviceDomains">
        {serviceSites.map(
          ({ url, rationale, urlError, rationaleError }, idx) => (
            <div key={idx} className="flex gap-10 my-5">
              <div className="flex-1">
                <RWSInput
                  inputLabel={I18n.getMessage('serviceDomainIdx', [
                    (idx + 1).toString(),
                  ])}
                  inputPlaceholder="https://service.com"
                  inputValue={url}
                  inputChangeHandler={(e) => {
                    setServiceSites({ idx, key: 'url', value: e.target.value });
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
                  inputPlaceholder={I18n.getMessage('affiliationHeading')}
                  inputValue={rationale}
                  inputChangeHandler={(e) => {
                    setServiceSites({
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
                <RemoveButton onClick={() => removeServiceSite(idx)} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ServiceSites;

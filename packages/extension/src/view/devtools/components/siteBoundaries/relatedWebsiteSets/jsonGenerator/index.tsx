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
import { Button } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import ContactEmail from './contactEmail';
import PrimaryDomain from './primaryDomain';
import AssociatedSites from './associatedSites';
import ServiceSites from './serviceSites';
import CountrySites from './countrySites';
import JsonOutput from './jsonOutput';
import useGeneratorForm from './useGeneratorForm';

const RWSJsonGenerator = () => {
  const {
    state: {
      contact,
      primaryDomain,
      associatedSites,
      serviceSites,
      countrySites,
      loading,
      validationPassed,
      primaryWellKnownOutput,
      otherWellKnownOutput,
    },
    actions: {
      setContact,
      setPrimaryDomain,
      addAssociatedSite,
      setAssociatedSites,
      removeAssociatedSite,
      addServiceSite,
      setServiceSites,
      removeServiceSite,
      addCountrySite,
      setCountrySites,
      removeCountrySite,
      submitForm,
      resetForm,
    },
  } = useGeneratorForm();

  return (
    <>
      <div className="overflow-auto py-6">
        <div className="text-raisin-black dark:text-bright-gray w-full min-w-[33rem]">
          <h1 className="text-lg font-semibold">
            {I18n.getMessage('rwsJsonGenerator')}
          </h1>
          <p
            className="text-xs py-3"
            dangerouslySetInnerHTML={{
              __html: I18n.getMessage('rwsJsonGeneratorNote', [
                `<a
              className="text-bright-navy-blue dark:text-jordy-blue hover:opacity-80"
              title="https://github.com/GoogleChrome/related-website-sets/blob/main/RWS-Submission_Guidelines.md"
              href="https://github.com/GoogleChrome/related-website-sets/blob/main/RWS-Submission_Guidelines.md"
              target="_blank"
              rel="noreferrer"
            >`,
                '</a>',
              ]),
            }}
          />
          <div className="mt-4 bg-anti-flash-white dark:bg-charleston-green border rounded-xl border-gray-200 dark:border-quartz px-4 py-3 shadow">
            <p className="text-base my-3">
              {I18n.getMessage('enterRwsDetails')}
            </p>
            <form onSubmit={submitForm} onReset={resetForm}>
              <ContactEmail
                contact={contact}
                setContact={setContact}
                validationFailed={!validationPassed}
              />
              <PrimaryDomain
                primaryDomain={primaryDomain}
                setPrimaryDomain={setPrimaryDomain}
                validationFailed={!validationPassed}
              />
              <div className="divide-y divide-american-silver dark:divide-quartz">
                <AssociatedSites
                  associatedSites={associatedSites}
                  setAssociatedSites={setAssociatedSites}
                  removeAssociatedSite={removeAssociatedSite}
                  addAssociatedSite={addAssociatedSite}
                  validationFailed={!validationPassed}
                />
                <ServiceSites
                  serviceSites={serviceSites}
                  setServiceSites={setServiceSites}
                  removeServiceSite={removeServiceSite}
                  addServiceSite={addServiceSite}
                  validationFailed={!validationPassed}
                />
                <CountrySites
                  countrySites={countrySites}
                  setCountrySites={setCountrySites}
                  removeCountrySite={removeCountrySite}
                  addCountrySite={addCountrySite}
                  availableSites={[
                    primaryDomain.url,
                    ...associatedSites.map(({ url }) => url),
                    ...serviceSites.map(({ url }) => url),
                  ].filter((url) => Boolean(url))}
                  validationFailed={!validationPassed}
                />
              </div>
              <div className="my-3 flex items-center justify-end">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full animate-spin border-t-transparent border-solid border-blue-700 border-2" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button text="Generate" type="submit" />
                    <Button text="Reset" type="reset" variant="secondary" />
                  </div>
                )}
              </div>
            </form>
          </div>
          {!loading && validationPassed && (
            <JsonOutput
              primaryWellKnownOutput={primaryWellKnownOutput}
              otherWellKnownOutput={otherWellKnownOutput}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RWSJsonGenerator;

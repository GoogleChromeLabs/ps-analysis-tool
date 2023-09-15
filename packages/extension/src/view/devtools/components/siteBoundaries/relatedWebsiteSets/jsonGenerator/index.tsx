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

/**
 * Internal dependencies.
 */
import ContactEmail from './contactEmail';
import PrimaryDomain from './primaryDomain';
import AssociatedSites from './associatedSites';
import ServiceSites from './serviceSites';
import CountrySites from './countrySites';
import JsonOutput from './jsonOutput';
import { Button } from '../../../../../design-system/components';
import useGeneratorForm from './useGeneratorForm';

interface RWSJsonGeneratorProps {
  open: boolean;
}

const RWSJsonGenerator = ({ open }: RWSJsonGeneratorProps) => {
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
      {open && (
        <div className="overflow-auto">
          <div className="text-raisin-black dark:text-bright-gray w-full min-w-[33rem]">
            <h1 className="text-lg font-semibold mt-4">
              Related Website Sets JSON Generator
            </h1>
            <p className="text-xs py-3">
              This tool generates the JSON resources needed to make a Related
              Website Sets(RWS) submission. It <b>does not</b> perform all the
              required technical validations (see full requirements{' '}
              <a
                className="text-blue-500 hover:opacity-70"
                href="https://github.com/GoogleChrome/first-party-sets/blob/main/FPS-Submission_Guidelines.md"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              ).
            </p>
            <div className="my-4 border rounded-xl border-gray-200 dark:border-quartz dark:bg-charleston-green px-4 py-3 shadow">
              <p className="text-base my-3">
                Enter your Related Website Sets details below:
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitForm();
                }}
                onReset={resetForm}
              >
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
                <div className="my-3 flex items-center justify-start">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full animate-spin border-t-transparent border-solid border-blue-700 border-2" />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button text="Submit" type="submit" />
                      <Button text="Reset" type="reset" variant="danger" />
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
      )}
    </>
  );
};

export default RWSJsonGenerator;

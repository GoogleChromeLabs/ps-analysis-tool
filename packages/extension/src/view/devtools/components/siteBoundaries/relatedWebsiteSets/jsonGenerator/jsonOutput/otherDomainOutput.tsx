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
import type {
  OtherWellKnownOutputType,
  PrimaryWellKnownOutputType,
} from '../types';
import Output from './output';

interface OtherDomainOutputProps {
  primaryWellKnownOutput: PrimaryWellKnownOutputType | null;
  otherWellKnownOutput: OtherWellKnownOutputType | null;
}

const OtherDomainOutput = ({
  primaryWellKnownOutput,
  otherWellKnownOutput,
}: OtherDomainOutputProps) => {
  return (
    <div className="py-3 mb-3">
      <div className="flex gap-2 items-start mb-4">
        <p className="text-xs leading-6 min-w-[1.5rem] min-h-[1.5rem] flex items-center justify-center bg-bright-navy-blue text-white rounded-full">
          2
        </p>
        <p className="text-base">
          Add the <code>.well-known</code> file to <b>all the other domains</b>{' '}
          in your set with the following content:
        </p>
      </div>
      <div id="domainsListOutput">
        <ul className="list-disc">
          {primaryWellKnownOutput && primaryWellKnownOutput.associatedSites && (
            <div className="mb-2">
              <p className="text-sm">Associated Sites</p>
              <div className="pl-4">
                {primaryWellKnownOutput.associatedSites.map((url) => (
                  <li key={url} className="text-sm">
                    {url}/.well-known/first-party-set.json
                  </li>
                ))}
              </div>
            </div>
          )}
          {primaryWellKnownOutput && primaryWellKnownOutput.serviceSites && (
            <div className="mb-2">
              <p className="text-sm">Service Sites</p>
              <div className="pl-4">
                {primaryWellKnownOutput.serviceSites.map((url) => (
                  <li key={url} className="text-sm">
                    {url}/.well-known/first-party-set.json
                  </li>
                ))}
              </div>
            </div>
          )}
          {primaryWellKnownOutput && primaryWellKnownOutput.ccTLDs && (
            <div className="mb-2">
              <p className="text-sm">Country Sites</p>
              <div className="pl-4">
                {Object.values(primaryWellKnownOutput.ccTLDs).map((cctlds) =>
                  cctlds.map((cctld) => (
                    <li key={cctld} className="text-sm">
                      {cctld}/.well-known/first-party-set.json
                    </li>
                  ))
                )}
              </div>
            </div>
          )}
        </ul>
      </div>
      <Output data={otherWellKnownOutput} />
    </div>
  );
};

export default OtherDomainOutput;

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
import type { PrimaryWellKnownOutputType } from '../types';
import Output from './output';
import { I18n } from '@google-psat/i18n';

interface PrimaryDomainOutputProps {
  primaryWellKnownOutput: PrimaryWellKnownOutputType | null;
}

const PrimaryDomainOutput = ({
  primaryWellKnownOutput,
}: PrimaryDomainOutputProps) => {
  return (
    <div className="py-3 mb-3">
      <div className="flex gap-2 items-start mb-4">
        <p className="text-xs leading-6 min-w-[1.5rem] min-h-[1.5rem] flex items-center justify-center bg-bright-navy-blue text-white rounded-full">
          1
        </p>
        <p className="text-base">{I18n.getMessage('addToRws')}</p>
      </div>
      <ul className="mb-2">
        <li id="primaryOutput" className="text-sm">
          {primaryWellKnownOutput && primaryWellKnownOutput.primary
            ? primaryWellKnownOutput.primary +
              '/.well-known/related-website-set.json'
            : ''}
        </li>
      </ul>
      <Output data={primaryWellKnownOutput} />
    </div>
  );
};

export default PrimaryDomainOutput;

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
import type { PrimaryDomainType } from '../types';
import { validateUrl } from '../utils';
import { RWSInput } from '../components';

interface PrimaryDomainProps {
  primaryDomain: PrimaryDomainType;
  setPrimaryDomain: (
    prev: (prev: PrimaryDomainType) => PrimaryDomainType
  ) => void;
  validationFailed: boolean;
}

const PrimaryDomain = ({
  primaryDomain,
  setPrimaryDomain,
  validationFailed: errorOccured,
}: PrimaryDomainProps) => {
  const updatePrimaryDomain = useCallback(
    (value: string) => {
      value = value.trim();

      setPrimaryDomain((prev) => {
        const newPrimaryDomain = { ...prev };
        newPrimaryDomain.url = value;
        newPrimaryDomain.urlError = validateUrl(value);

        return newPrimaryDomain;
      });
    },
    [setPrimaryDomain]
  );

  return (
    <div className="my-4">
      <RWSInput
        inputLabel="Set Primary Domain"
        inputPlaceholder="https://primary.com"
        inputValue={primaryDomain.url}
        inputChangeHandler={(e) => updatePrimaryDomain(e.target.value)}
        error={primaryDomain.urlError}
        errorOccured={errorOccured}
      />
    </div>
  );
};

export default PrimaryDomain;

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
import PSInfo from './PSInfo.json';
import LearnMoreDropdown from './learnMoreDropdown';
import type { PSInfoKeyType } from './types';

interface InfoCardProps {
  infoKey: PSInfoKeyType;
}

const InfoCard = ({ infoKey }: InfoCardProps) => {
  return (
    <div className="max-w-sm p-6 m-3 bg-white border border-gray-200 rounded-lg shadow">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {PSInfo[infoKey].name}
      </h5>
      <p className="mb-3 text-gray-700">{PSInfo[infoKey].description}</p>
      <LearnMoreDropdown infoKey={infoKey} />
    </div>
  );
};

export default InfoCard;

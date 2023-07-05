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
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import LearnMoreDropdown from './learnMoreDropdown';
import {
  fetchPSInfo,
  type PSInfo as PSInfoType,
  type PSInfoKeyType,
} from '../../../../utils/fetchPSInfo';

interface InfoCardProps {
  infoKey: PSInfoKeyType;
}

const InfoCard = ({ infoKey }: InfoCardProps) => {
  const [PSInfo, setPSInfo] = useState({} as PSInfoType);

  useEffect(() => {
    (async function () {
      const info = await fetchPSInfo(infoKey);

      setPSInfo(info);
    })();
  }, [infoKey]);

  return (
    <div className="max-w-sm bg-white m-3">
      {Object.keys(PSInfo).length ? (
        <div className="p-6 border border-gray-200 rounded-lg shadow">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {PSInfo.name}
          </h5>
          <p className="mb-3 text-gray-700">{PSInfo.description}</p>
          <LearnMoreDropdown PSInfo={PSInfo} />
        </div>
      ) : (
        <div className="p-6">
          <div className="w-10 h-10 rounded-full animate-spin border-t-transparent border-solid border-blue-700 border-4"></div>
        </div>
      )}
    </div>
  );
};

export default InfoCard;

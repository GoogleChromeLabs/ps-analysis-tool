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
} from './fetchPSInfo';

interface InfoCardProps {
  infoKey: PSInfoKeyType;
  className?: string;
}

const InfoCard = ({ infoKey, className }: InfoCardProps) => {
  const [PSInfo, setPSInfo] = useState({} as PSInfoType);

  useEffect(() => {
    (async function () {
      const info = await fetchPSInfo(infoKey);

      setPSInfo(info);
    })();
  }, [infoKey]);

  return (
    <>
      {Object.keys(PSInfo).length ? (
        <div className={className}>
          <p
            className="mb-3 text-raisin-black dark:text-bright-gray text-sm"
            dangerouslySetInnerHTML={{ __html: PSInfo.description }}
          />
          <LearnMoreDropdown PSInfo={PSInfo} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 rounded-full animate-spin border-t-transparent border-solid border-blue-700 border-4" />
        </div>
      )}
    </>
  );
};

export default InfoCard;

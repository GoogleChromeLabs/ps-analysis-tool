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
import RestrictionInfoContainer from './restrictionInfoContainer';
import InfoCards from './infoCards';

/**
 * Internal dependencies.
 */

const FacilitatedTestingContent = () => {
  return (
    <div className="m-auto md:w-[70%] min-w-[30rem]">
      <div className="w-full h-full border border-hex-gray dark:border-quartz text-raisin-black dark:text-bright-gray rounded-lg px-8 py-10 flex flex-col gap-8">
        <RestrictionInfoContainer />
        <div className="px-2">
          <InfoCards />
        </div>
      </div>
    </div>
  );
};

export default FacilitatedTestingContent;

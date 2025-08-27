/*
 * Copyright 2024 Google LLC
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
import { useProtectedAudience } from '../../../../stateProviders';
import IGTable from './table';
import EvaluationEnvironment from '../evaluationEnvironment';

const InterestGroups = () => {
  const { interestGroupDetails } = useProtectedAudience(({ state }) => ({
    interestGroupDetails: state.interestGroupDetails,
  }));
  if (!interestGroupDetails || interestGroupDetails.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-lg text-raisin-black dark:text-bright-gray">
          No interests group events recorded.
        </p>
        <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the interest group events if you haven’t already." />
      </div>
    );
  }

  return <IGTable interestGroupDetails={interestGroupDetails} />;
};

export default InterestGroups;

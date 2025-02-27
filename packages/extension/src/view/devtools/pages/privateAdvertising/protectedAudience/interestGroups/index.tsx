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
import { useSidebar, SIDEBAR_ITEMS_KEYS } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { useProtectedAudience, useSettings } from '../../../../stateProviders';
import IGTable from './table';
import EvaluationEnvironment from '../evaluationEnvironment';

const InterestGroups = () => {
  const { interestGroupDetails } = useProtectedAudience(({ state }) => ({
    interestGroupDetails: state.interestGroupDetails,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view interest group events, enable PSAT to use CDP via the{' '}
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={() => {
              document
                .getElementById('cookies-landing-scroll-container')
                ?.scrollTo(0, 0);
              updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
            }}
          >
            Settings Page
          </button>
          .
        </p>
      </div>
    );
  }

  if (!interestGroupDetails || interestGroupDetails.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          No interests group events recorded.
        </p>
        <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the interest group events if you haven’t already." />
      </div>
    );
  }

  return <IGTable interestGroupDetails={interestGroupDetails} />;
};

export default InterestGroups;

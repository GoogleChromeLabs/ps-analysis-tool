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
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import InfoCard from '../../../../design-system/components/infoCard';
import { PSInfoKey } from '../../../../../utils/fetchPSInfo';
import { Button } from '../../../../design-system/components';
import Insights from './insights';

const RelatedWebsiteSets = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className="w-full h-full overflow-auto"
      data-testid="related-website-sets-content"
    >
      {showForm ? (
        <>Placeholder</>
      ) : (
        <>
          <InfoCard infoKey={PSInfoKey.RelatedWebsiteSets} />
          <div className="text-raisin-black dark:text-bright-gray max-w-2xl dark:bg-davys-grey border border-gray-200 dark:border-quartz rounded-lg shadow p-6 m-3 flex flex-col gap-4 divide-y divide-gray-200 dark:divide-gray-500">
            <Insights />
            <div className="pt-3">
              <Button
                text="Generate RWS JSON Resources"
                onClick={() => setShowForm(!showForm)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RelatedWebsiteSets;

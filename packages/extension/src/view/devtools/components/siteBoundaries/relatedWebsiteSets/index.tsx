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
import { Button, LandingPage } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import InfoCard from '../../../../design-system/components/infoCard';
import { PSInfoKey } from '../../../../../utils/fetchPSInfo';
import RWSJsonGenerator from './jsonGenerator';
import Insights from './insights';

const RelatedWebsiteSets = () => {
  const [showForm, setShowForm] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  return (
    <LandingPage title={pageTitle} isLoading={!pageTitle}>
      <div
        className="max-w-2xl h-fit overflow-auto divide-y divide-american-silver dark:divide-quartz"
        data-testid="related-website-sets-content"
      >
        <div className="px-4">
          <InfoCard
            infoKey={PSInfoKey.RelatedWebsiteSets}
            setTitle={setPageTitle}
          />
        </div>
        <div className="py-6 text-raisin-black dark:text-bright-gray flex flex-col gap-3">
          <div className="px-4">
            <Insights />
          </div>
          <RWSJsonGenerator open={showForm} setOpen={setShowForm} />
          {!showForm && (
            <div className="pt-4 px-4">
              <Button
                text="Generate RWS JSON Resources"
                onClick={() => setShowForm(true)}
              />
            </div>
          )}
        </div>
      </div>
    </LandingPage>
  );
};

export default RelatedWebsiteSets;

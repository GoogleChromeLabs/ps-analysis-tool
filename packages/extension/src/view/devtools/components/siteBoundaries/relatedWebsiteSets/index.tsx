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
import { LandingPage } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import InfoCard from '../../../../design-system/components/infoCard';
import { PSInfoKey } from '../../../../../utils/fetchPSInfo';
import RWSJsonGenerator from './jsonGenerator';
import Insights from './insights';

const RelatedWebsiteSets = () => {
  const [pageTitle, setPageTitle] = useState('');

  return (
    <LandingPage title={pageTitle} isLoading={!pageTitle}>
      <div
        className="max-w-2xl h-fit px-4 overflow-auto divide-y divide-american-silver dark:divide-quartz"
        data-testid="related-website-sets-content"
      >
        <InfoCard
          infoKey={PSInfoKey.RelatedWebsiteSets}
          setTitle={setPageTitle}
        />
        <Insights />
        <RWSJsonGenerator />
      </div>
    </LandingPage>
  );
};

export default RelatedWebsiteSets;

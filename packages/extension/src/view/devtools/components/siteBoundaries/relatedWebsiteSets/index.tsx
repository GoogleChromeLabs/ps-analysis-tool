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
import InfoCard from '../../../../design-system/components/infoCard';
import { PSInfoKey } from '../../../../../utils/fetchPSInfo';
import { MessageBox } from '../../../../design-system/components';

const RelatedWebsiteSets = () => {
  return (
    <div
      className="w-full h-full overflow-auto"
      data-testid="related-website-sets-content"
    >
      <InfoCard infoKey={PSInfoKey.RelatedWebsiteSets} />
      <MessageBox
        bodyText="Insights and a JSON generator for RWS registration are coming soon..."
        headerText="🚧 Under Construction"
      />
    </div>
  );
};

export default RelatedWebsiteSets;

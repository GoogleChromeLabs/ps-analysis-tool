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
 * External Dependencies
 */
import React from 'react';
import { LandingPageContainer } from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import { PRIVATE_ADVERTISING_CONTENT } from '../constants';

const PrivateAdvertising = () => {
  return (
    <LandingPageContainer
      title={I18n.getMessage('privateAdvertising')}
      extraClasses="w-full p-4"
      contentPanelTitle={I18n.getMessage('privateAdvertisingDescription')}
      content={PRIVATE_ADVERTISING_CONTENT}
      titleStyles="text-blue-600"
    />
  );
};

export default PrivateAdvertising;

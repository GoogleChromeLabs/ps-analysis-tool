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

import { PRIVACY_PROTECTION_CONTENT } from '../constants';

const PrivacyProtection = () => {
  return (
    <LandingPageContainer
      title="Tracking Protection"
      extraClasses="min-h-[78vh] w-full"
      contentPanelTitle={I18n.getMessage('antiCovertTrackingDescription')}
      content={PRIVACY_PROTECTION_CONTENT}
      titleStyles="text-blue-600"
    />
  );
};

export default PrivacyProtection;

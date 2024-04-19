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
import { LandingPage } from '@ps-analysis-tool/design-system';
import { I18n } from '@ps-analysis-tool/i18n';

const AntiCovertTracking = () => {
  return (
    <LandingPage
      title={I18n.getMessage('extTrackingProtection')}
      iframeSrc="https://privacysandbox.info/en/privacy-sandbox/prevent-covert-tracking"
      extraClasses="h-[78vh] w-full"
    />
  );
};

export default AntiCovertTracking;

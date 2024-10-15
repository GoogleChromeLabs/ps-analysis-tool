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
import React, { useEffect } from 'react';
import { LandingPage } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import ContentPanel from './contentPanel';

const PrivacySandbox = () => {
  useEffect(() => {
    (async () => {
      await chrome.storage.sync.set({
        psLandingPageViewed: true,
      });
    })();
  }, []);

  return (
    <LandingPage
      title="Privacy Sandbox"
      showSupportLink={true}
      contentPanel={<ContentPanel />}
    />
  );
};

export default PrivacySandbox;

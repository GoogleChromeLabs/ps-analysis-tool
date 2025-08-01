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
import { LandingPage } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import ContentPanel from './contentPanel';
import { useWebStories } from '../../../stateProviders';

const WebStories = () => {
  const { storyOpened } = useWebStories(({ state }) => ({
    storyOpened: state.storyOpened,
  }));

  return (
    <div className="w-full h-full overflow-hidden">
      <LandingPage
        title={'Stories'}
        hideTitle={storyOpened}
        extraClasses="w-full h-full"
        contentPanel={<ContentPanel storyOpened={storyOpened} />}
        showQuickLinks={false}
      />
    </div>
  );
};

export default WebStories;

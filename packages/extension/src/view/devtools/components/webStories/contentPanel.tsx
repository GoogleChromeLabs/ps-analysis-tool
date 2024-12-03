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
import React, { useEffect, useState } from 'react';
/**
 * Internal dependencies.
 */
import { getStoryMarkup, type SingleStoryJSON } from './createStoryIframe';

const WebStories = () => {
  const [storyMarkup, setStoryMarkup] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://privacysandbox-stories.com/wp-json/web-stories/v1/web-story/'
      );

      const responseJSON = await response.json();
      const storyJSON: SingleStoryJSON[] = [];
      responseJSON.forEach((singleResponse: any) => {
        if (singleResponse?.status === 'publish') {
          storyJSON.push({
            heroImage: singleResponse?.story_poster?.url ?? '',
            publisherLogo: 'https://assets.codepen.io/1780597/1pizza_logo.png',
            publisherName: '',
            storyTitle: singleResponse?.title?.rendered,
            storyUrl: `${singleResponse?.link}#embedMode=2`,
          });
        }
      });
      setStoryMarkup(getStoryMarkup(storyJSON));
    })();
  }, []);

  return (
    <div
      data-testid="web-stories-content"
      className="h-full w-full text-raisin-black dark:text-bright-gray overflow-y-auto"
    >
      <iframe
        scrolling="yes"
        srcDoc={storyMarkup}
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
};

export default WebStories;

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
/**
 * Internal dependencies.
 */
import { getStoryMarkup } from './createStoryIframe';
import { STORY_JSON } from './story';

const WebStories = () => {
  const storyMarkup = getStoryMarkup(STORY_JSON);
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(storyMarkup, 'text/html');
  let parsedEmbeddedHtml = storyMarkup;

  Array.from(doc.scripts).forEach((script, index) => {
    if (!script.src || !doc.scripts.item(index)) {
      return;
    }

    switch (script.src) {
      case 'https://cdn.ampproject.org/v0/amp-animation-0.1.js':
        parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
          'https://cdn.ampproject.org/v0/amp-animation-0.1.js',
          chrome.runtime.getURL('assets/data/amp-animation-0.1.js')
        );
        break;
      case 'https://cdn.ampproject.org/v0/amp-video-0.1.js':
        parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
          'https://cdn.ampproject.org/v0/amp-video-0.1.js',
          chrome.runtime.getURL('assets/data/amp-video-0.1.js')
        );
        break;
      case 'https://cdn.ampproject.org/amp4ads-v0.js':
        parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
          'https://cdn.ampproject.org/amp4ads-v0.js',
          chrome.runtime.getURL('assets/data/amp4ads-v0.js')
        );
        break;
      case 'https://cdn.ampproject.org/amp-story-player-v0.js':
        parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
          'https://cdn.ampproject.org/amp-story-player-v0.js',
          chrome.runtime.getURL('assets/data/amp-story-player-v0.js')
        );
        break;
      case 'https://cdn.ampproject.org/v0.js':
        parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
          'https://cdn.ampproject.org/v0.js',
          chrome.runtime.getURL('assets/data/v0.js')
        );
        break;
      case 'https://cdn.ampproject.org/v0/amp-story-1.0.js':
        parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
          'https://cdn.ampproject.org/v0/amp-story-1.0.js',
          chrome.runtime.getURL('assets/data/amp-story-1.0.js')
        );
        break;
      default:
        if (script.src.endsWith('main.js')) {
          parsedEmbeddedHtml = parsedEmbeddedHtml.replace(
            'main.js',
            chrome.runtime.getURL('assets/data/amp-player-main.js')
          );
        }
        script.remove();
        break;
    }
  });

  return (
    <div
      data-testid="web-stories-content"
      className="h-full w-full text-raisin-black dark:text-bright-gray px-2 overflow-y-auto"
    >
      <iframe
        srcDoc={parsedEmbeddedHtml}
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
};

export default WebStories;

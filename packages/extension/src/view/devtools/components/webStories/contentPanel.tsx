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
import React, { useCallback, useEffect, useState } from 'react';
/**
 * Internal dependencies.
 */
import { getStoryMarkup, type SingleStoryJSON } from './createStoryIframe';

const WebStories = () => {
  const [storyMarkup, setStoryMarkup] = useState('');

  const getAuthorsAndPublisherLogo = useCallback(
    async (mediaAuthorSet: Record<number, string>) => {
      const response = await fetch(
        'https://privacysandbox-stories.com/wp-json/web-stories/v1/users'
      );
      const responseJSON = await response.json();
      const transformedMediaAuthorMap: Record<
        number,
        Record<string, string>
      > = {};

      const authorNameIdMap: Record<number, string> = {};

      responseJSON.forEach((singleResponse: Record<string, any>) => {
        authorNameIdMap[singleResponse.id] = singleResponse.name;
      });

      await Promise.all(
        Object.keys(mediaAuthorSet).map(async (key: string) => {
          const mediaResponse = await fetch(
            'https://privacysandbox-stories.com/wp-json/web-stories/v1/media/' +
              mediaAuthorSet[Number(key)]
          );

          //Check the media response and get the avif/webp image if available else use source_url.
          const mediaResponseJSON = await mediaResponse.json();
          const sourceUrl = mediaResponseJSON.source_url;
          const splittedUrl = sourceUrl.split('/');
          const urlWithoutName = sourceUrl.substring(
            0,
            sourceUrl.length - splittedUrl[splittedUrl.length - 1].length
          );

          const avifResource =
            urlWithoutName +
            mediaResponseJSON?.media_details?.sources?.['image/avif']?.file;
          const webpResource =
            urlWithoutName +
            mediaResponseJSON?.media_details?.sources?.['image/webp']?.file;

          transformedMediaAuthorMap[Number(key)] = {
            name: authorNameIdMap[Number(key)],
            publisherLogo: avifResource ?? webpResource ?? sourceUrl,
          };
        })
      );
      return transformedMediaAuthorMap;
    },
    []
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://privacysandbox-stories.com/wp-json/web-stories/v1/web-story/'
      );

      const responseJSON = await response.json();
      let storyJSON: SingleStoryJSON[] = [];
      const mediaAuthorSet: Record<number, string> = {};
      responseJSON.forEach((singleResponse: any) => {
        if (singleResponse?.status === 'publish') {
          mediaAuthorSet[singleResponse.author] =
            singleResponse?.meta?.web_stories_publisher_logo;

          storyJSON.push({
            heroImage: singleResponse?.story_poster?.url ?? '',
            publisherLogo: singleResponse?.meta?.web_stories_publisher_logo,
            publisherName: singleResponse?.author,
            storyTitle: singleResponse?.title?.rendered,
            storyUrl: `${singleResponse?.link}#embedMode=2`,
          });
        }
      });

      const authorsAndPublisherLogoMap = await getAuthorsAndPublisherLogo(
        mediaAuthorSet
      );

      storyJSON = storyJSON.map((story) => {
        const key = Number(story.publisherName);
        story.publisherName = authorsAndPublisherLogoMap[key]?.name;
        story.publisherLogo = authorsAndPublisherLogoMap[key]?.publisherLogo;
        return story;
      });

      setStoryMarkup(getStoryMarkup(storyJSON));
    })();
  }, [getAuthorsAndPublisherLogo]);

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

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
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { BASE_API_URL } from '../constants';

export const apiDataFetcher = async (
  endpoint: string,
  stateSetter: React.Dispatch<React.SetStateAction<Record<number, string>>>
) => {
  const response = await fetch(BASE_API_URL + endpoint);

  const responseJson = await response.json();
  const objectIdNameMap: Record<number, string> = {};

  responseJson.forEach((singleObject: any) => {
    objectIdNameMap[singleObject.id] = singleObject.name;
  });

  stateSetter(objectIdNameMap);
};

export const getMediaUrl = async (
  mediaAuthorSet: Record<number, string>,
  authors: Record<number, string>
) => {
  const transformedMediaAuthorMap: Record<number, Record<string, string>> = {};

  await Promise.all(
    Object.keys(mediaAuthorSet).map(async (key: string) => {
      const mediaResponse = await fetch(
        `${BASE_API_URL}/media/${mediaAuthorSet[Number(key)]}`
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
        name: authors[Number(key)],
        publisherLogo: avifResource ?? webpResource ?? sourceUrl,
      };
    })
  );

  return transformedMediaAuthorMap;
};

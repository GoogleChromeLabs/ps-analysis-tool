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
import React, { useEffect, useRef, useState } from 'react';
import { type Cookie as ParsedCookie } from 'simple-cookie';
import { type CookieAnalytics } from '../../../../../../utils/fetchCookieDictionary';

interface ICookieDetails {
  data: ParsedCookie;
  analytics: CookieAnalytics | null;
}

const CookieDetails = ({ data, analytics }: ICookieDetails) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [shouldShowMoreButton, setShouldShowMoreButton] =
    useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const isDescriptionTruncated =
        descriptionRef.current.clientHeight <
        descriptionRef.current.scrollHeight;

      setShouldShowMoreButton(isDescriptionTruncated);
    }
  }, []);
  return (
    <div
      className="mt-5 rounded-xl shadow-md border leading-6 w-9/12 lg:w-8/12 mx-auto max-w-[600px] overflow-hidden"
      data-testid="cookie-card"
    >
      <div className="mb-2 py-3 px-8 flex flex-col bg-[#F1F1F1] border-b border-[#CACACA]">
        <h1 className="font-bold text-xl truncate mb-3">{data.name}</h1>
        <div className="inline-block">
          <p
            ref={descriptionRef}
            className={`text-xs ${
              showMore ? '' : 'line-clamp-2'
            } text-secondary`}
          >
            {analytics?.description || 'No description available.'}
          </p>
          {shouldShowMoreButton && (
            <button
              className="text-md font-bold"
              onClick={() => {
                setShowMore(!showMore);
              }}
            >
              {showMore ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col p-8 pt-2 pb-4 divide-y divide-[#F1F1F1]">
        <div className="flex items-center py-2">
          <h1 className="w-1/4 font-semibold text-s text-[#808080]">Domain</h1>
          <p className="w-3/4 text-xs text-tertiary truncate">{data.domain}</p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Path</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">{data.path}</p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Samesite</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">
            {data.samesite}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Platform</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">
            {analytics?.platform}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Retention period</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">
            {analytics?.retention}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">GDPR Portal</h1>
          <p
            className="w-3/4 text-xs text-tertiary truncate hover:underline cursor-pointer"
            onClick={() => {
              if (analytics?.gdprUrl) {
                chrome.tabs.create({ url: analytics?.gdprUrl });
              }
            }}
          >
            {analytics?.gdprUrl}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Value</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">{data.value}</p>
        </div>
      </div>
    </div>
  );
};
export default CookieDetails;

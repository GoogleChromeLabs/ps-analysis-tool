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
import React from 'react';
import { type Cookie as ParsedCookie } from 'simple-cookie';
import { type CookieAnalytics } from '../../../../../../utils/fetchCookieDictionary';

interface ICookieDetails {
  data: ParsedCookie;
  analytics: CookieAnalytics | null;
}

const CookieDetails = ({ data, analytics }: ICookieDetails) => (
  <div className="flex flex-col p-4 items-center">
    <div className="w-2/3 mb-1 flex flex-col gap-2">
      <h1 className="font-bold text-xl mb-2">
        {data.name +
          (analytics?.platform ? ' (' + analytics?.platform + ')' : '')}
      </h1>
      <p className="my-1 text-xs text-secondary">
        {analytics?.description || 'No description available.'}
      </p>
    </div>
    <div className=" w-2/3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s">Domain</h1>
        <p className="text-xs text-secondary  truncate">{data.domain}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s">Path</h1>
        <p className="text-xs text-secondary  truncate">{data.path}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s">Samesite</h1>
        <p className="text-xs text-secondary  truncate">{data.samesite}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s">Platform</h1>
        <p className="text-xs text-secondary  truncate">
          {analytics?.platform}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s">Retention period</h1>
        <p className="text-xs text-secondary  truncate">
          {analytics?.retention}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s">GDPR Portal</h1>
        <p className="text-xs text-secondary  truncate">{analytics?.gdprUrl}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-s mr-2">Value</h1>
        <p className=" text-xs text-secondary  truncate">{data.value}</p>
      </div>
    </div>
  </div>
);
export default CookieDetails;

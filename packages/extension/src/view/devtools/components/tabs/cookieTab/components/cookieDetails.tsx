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

const Header = ({
  name,
  platform,
  description = '',
}: {
  name: string;
  platform: string | undefined;
  description: string | undefined;
}) => {
  return (
    <div className="w-full h-full bg-gray-200 px-10 flex flex-col justify-center">
      <h1 className="font-bold text-xl mb-2 truncate">
        {name + (platform ? ` (${platform})` : '')}
      </h1>
      <p className="text-sm text-secondary truncate">{description}</p>
    </div>
  );
};

const DetailItem = ({
  name,
  value = '',
}: {
  name: string;
  value: string | undefined;
}) => (
  <div className="w-full h-12 flex items-center border-b-2 border-gray-100">
    <h1 className="w-1/4 font-semibold text-md text-gray-400">{name}</h1>
    <p className=" w-3/4 text-md text-secondary truncate">{value}</p>
  </div>
);
interface ICookieDetails {
  data: ParsedCookie;
  analytics: CookieAnalytics | null;
}

const Details = ({ data, analytics }: ICookieDetails) => (
  <div className="w-full h-full flex flex-col px-10 pt-6">
    <DetailItem name="Domain" value={data.domain} />
    <DetailItem name="Path" value={data.path} />
    <DetailItem name="Samesite" value={data.samesite} />
    <DetailItem name="Platform" value={analytics?.platform} />
    <DetailItem name="GDPR Url" value={analytics?.gdprUrl} />
    <DetailItem name="Value" value={data.value} />
  </div>
);

const CookieDetails = ({ data, analytics }: ICookieDetails) => (
  <div
    className="w-full aspect-[4/3] rounded-lg shadow-lg overflow-hidden "
    data-testid="cookie-card"
  >
    <div className="w-full h-[25%]">
      <Header
        name={data.name}
        platform={analytics?.platform}
        description={analytics?.description}
      />
    </div>
    <div className="w-full h-[75%]">
      <Details data={data} analytics={analytics} />
    </div>
  </div>
);
export default CookieDetails;

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
 * External dependencies
 */
import type { TechnologyData } from '@ps-analysis-tool/common';
import { type Cookie as ParsedCookie } from 'simple-cookie';

export type SanitisedCookieType = ParsedCookie & {
  category: string;
  platform: string;
  gdprPortal: string;
  sameSite: string;
  scope: string;
};
export interface SingleTechnology {
  name: string;
  description: string;
  confidence: number;
  website: string;
  categories: string;
}

export type CookieJsonDataType = {
  name: string;
  value: string;
  domain: string;
  partitionKey?: string;
  path: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
  platform: string;
  category: string;
  description: string;
  isFirstParty: boolean;
  pageUrl: string;
  requestUrls?: { [id: string]: string };
  frameUrls?: { [id: string]: string };
  isBlocked: boolean;
  blockedReasons?: string[];
  GDPR?: string;
};

export type CookieFrameStorageType = {
  [frame: string]: {
    [cookieKey: string]: CookieJsonDataType;
  };
};

export type CompleteJson = {
  pageUrl: string;
  cookieData: {
    [frame: string]: {
      cookiesCount: number;
      frameCookies: {
        [cookieKey: string]: CookieJsonDataType;
      };
    };
  };
  technologyData: TechnologyData[];
};

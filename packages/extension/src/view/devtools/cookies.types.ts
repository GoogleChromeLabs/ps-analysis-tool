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
 * Internal dependencies.
 */
import type { CookieData } from '../../localStore/cookieStore';

export type CookieTableData = CookieData & {
  isCookieSet: boolean | null;
};

export interface TabCookies {
  [key: string]: CookieTableData;
}

export interface TabFrames {
  [key: string]: { frameIds: number[] };
}

export interface Legend {
  label: string;
  count: number;
  color: string;
  countClassName: string;
}

export interface CookieStatsComponents {
  legend: Legend[];
  firstParty: {
    count: number;
    color: string;
  }[];
  thirdParty: {
    count: number;
    color: string;
  }[];
}

export interface FramesWithCookies {
  [key: string]: { frameIds: number[] };
}

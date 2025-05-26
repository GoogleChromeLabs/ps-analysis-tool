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
import type {
  AdsAndBiddersType,
  CookieData,
  PrebidNoBidsType,
  ReceivedBids,
} from '@google-psat/common';

export type PreferenceKeyValues =
  | 'columnSorting'
  | 'selectedFrame'
  | 'columnSizing'
  | 'selectedColumns'
  | 'selectedFilter';

export type TabData = {
  cookies: {
    [key: string]: CookieData;
  } | null;
  preferences: {
    [key: string]: unknown;
  };
};

export type Storage = {
  [tabId: string]: TabData;
};

export type AllowedDomainObject = {
  primaryDomain: string;
  primaryPattern: string;
  secondaryPattern: string;
  scope: string;
};

export type AllowedDomainStorage = {
  allowList: AllowedDomainObject[];
};

export type PrebidWarningTypes = 'WARNING' | 'ERROR' | 'INFO';

export type PrebidEvents = {
  adUnits: AdsAndBiddersType;
  noBids: PrebidNoBidsType;
  versionInfo: string;
  receivedBids: ReceivedBids[];
  errorEvents: {
    type: PrebidWarningTypes;
    message: string[];
    time: string;
  }[];
  auctionEvents: { [auctionId: string]: any[] };
  installedModules: string[];
  config: PrebidConfig;
  pbjsNamespace: string;
};

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
export type CookieAnalytics = {
  id: string;
  platform: string;
  category: string;
  subCategory: string;
  functionality: string;
  description: string;
  dataController: string;
  GDPRPortal: string;
  retentionPeriod: string;
  usage: string;
  popularity: string;
  comment: string[];
};

export type CookieAnalyticsRaw = {
  ID: string;
  Platform: string;
  Category: string;
  Domain: string;
  Description: string;
  Key: string;
  DataController: string;
  Retention: string;
  GDPR: string;
  Wildcard: string;
};

export type CookieDatabase = {
  [category: string]: Array<CookieAnalyticsRaw>;
};

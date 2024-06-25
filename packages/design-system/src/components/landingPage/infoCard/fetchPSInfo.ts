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
import { fetchLocalData } from '@google-psat/common';

export enum PSInfoKey {
  'Topics' = 'topics',
  'AttributionReporting' = 'attribution-reporting',
  'ProtectedAudience' = 'protected-audience',
  'BounceTracking' = 'bounce-tracking',
  'UserAgentReduction' = 'user-agent-reduction',
  'RelatedWebsiteSets' = 'related-website-sets',
  'Chips' = 'chips',
}

export type PSInfoKeyType = (typeof PSInfoKey)[keyof typeof PSInfoKey];

export type PSInfo = {
  name: string;
  description: string;
  useI18n: boolean;
  proposal: string;
  publicExplainer: string;
  publicDiscussion: string;
  videoOverview: string;
  devDocumentation: string;
};

/**
 * Fetch PSInfo from local data folder.
 * @param infoKey {PSInfoKeyType} PSInfo key to fetch
 * @returns {Promise<PSInfo>} PSInfo data object
 */
export async function fetchPSInfo(infoKey: PSInfoKeyType): Promise<PSInfo> {
  const data = await fetchLocalData('data/PSInfo.json');

  return data[infoKey];
}

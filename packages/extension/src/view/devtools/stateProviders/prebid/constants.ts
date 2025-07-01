/*
 * Copyright 2025 Google LLC
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
export interface ReplaceRuleKeyOptions {
  default: string;
  label: string;
  mediaType: string;
  options?: string[];
  subkey?: string;
  value: string;
  type: string;
}
export const replaceRuleTargets: ReplaceRuleKeyOptions[] = [
  // all mediaTypes
  {
    value: 'bidderCode',
    label: 'bidderCode',
    mediaType: 'allMediaTypes',
    default: '',
    type: 'string',
  },
  {
    value: 'cpm',
    label: 'cpm',
    mediaType: 'allMediaTypes',
    default: '20',
    type: 'number',
  },
  {
    value: 'currency',
    label: 'currency',
    mediaType: 'allMediaTypes',
    default: 'USD',
    type: 'string',
  },
  {
    value: 'dealId',
    label: 'dealId',
    mediaType: 'allMediaTypes',
    default: '',
    type: 'string',
  },
  {
    value: 'mediaType',
    label: 'mediaType',
    mediaType: 'allMediaTypes',
    default: 'banner',
    options: ['banner', 'native', 'video'],
    type: 'string',
  },
  {
    value: 'meta',
    label: 'meta',
    mediaType: 'allMediaTypes',
    default: '',
    type: 'string',
  },
  {
    value: 'netRevenue',
    label: 'netRevenue',
    mediaType: 'allMediaTypes',
    default: '',
    type: 'number',
  },
  {
    value: 'requestBidder',
    label: 'requestBidder',
    mediaType: 'allMediaTypes',
    default: '',
    type: 'string',
  },
  {
    value: 'ttl',
    label: 'ttl',
    mediaType: 'allMediaTypes',
    default: '',
    type: 'number',
  },
  //mediaType banner
  {
    value: 'ad',
    label: 'ad',
    mediaType: 'banner',
    default: '',
    type: 'string',
  },
  {
    value: 'height',
    label: 'height',
    mediaType: 'banner',
    default: '300',
    type: 'number',
  },
  {
    value: 'width',
    label: 'width',
    mediaType: 'banner',
    default: '',
    type: 'number',
  },
];

export const matchRuleTargets: { value: string; label: string }[] = [
  { value: 'adUnitCode', label: 'AdUnitCode' },
  { value: 'bidder', label: 'Bidder' },
];

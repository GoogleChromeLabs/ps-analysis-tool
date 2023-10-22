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
import {
  CookieIcon,
  CookieIconWhite,
  SiteBoundariesIcon,
  SiteBoundariesIconWhite,
  ChipsIcon,
  ChipsIconWhite,
  RelatedWebsiteSetsIcon,
  RelatedWebsiteSetsIconWhite,
  PrivateAdvertisingIcon,
  PrivateAdvertisingIconWhite,
  AntiCovertTrackingIcon,
  AntiCovertTrackingIconWhite,
  AttributionIcon,
  AttributionIconWhite,
  BounceTrackingIcon,
  BounceTrackingIconWhite,
  FingerPrintingIcon,
  FingerPrintingIconWhite,
  TopicsIcon,
  TopicsIconWhite,
  PrivacySandboxIcon,
  PrivacySandboxIconWhite,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import {
  Cookies,
  SiteBoundaries,
  Chips,
  RelatedWebsiteSets,
  PrivateAdvertising,
  AntiCovertTracking,
  Topics,
  Attribution,
  BounceTracking,
  Fingerprinting,
  PrivacySandbox,
} from './components';

const TABS = [
  {
    display_name: 'Privacy Sandbox',
    component: PrivacySandbox,
    id: 'privacySandbox',
    icons: {
      default: PrivacySandboxIcon,
      selected: PrivacySandboxIconWhite,
    },
    hasChildren: true,
  },
  {
    display_name: 'Cookies',
    component: Cookies,
    id: 'cookies',
    icons: {
      default: CookieIcon,
      selected: CookieIconWhite,
    },
    parentId: 'privacySandbox',
    hasChildren: true,
  },
  {
    display_name: 'Site Boundaries',
    component: SiteBoundaries,
    id: 'siteBoundaries',
    icons: {
      default: SiteBoundariesIcon,
      selected: SiteBoundariesIconWhite,
    },
    parentId: 'privacySandbox',
    hasChildren: true,
  },
  {
    display_name: 'CHIPS',
    component: Chips,
    id: 'chips',
    icons: {
      default: ChipsIcon,
      selected: ChipsIconWhite,
    },
    parentId: 'siteBoundaries',
  },
  {
    display_name: 'Related Website Sets',
    component: RelatedWebsiteSets,
    id: 'relatedWebsiteSets',
    icons: {
      default: RelatedWebsiteSetsIcon,
      selected: RelatedWebsiteSetsIconWhite,
    },
    parentId: 'siteBoundaries',
  },
  {
    display_name: 'Private Advertising',
    component: PrivateAdvertising,
    id: 'privateAdvertising',
    icons: {
      default: PrivateAdvertisingIcon,
      selected: PrivateAdvertisingIconWhite,
    },
    parentId: 'privacySandbox',
    hasChildren: true,
  },
  {
    display_name: 'Topics',
    component: Topics,
    id: 'topics',
    icons: {
      default: TopicsIcon,
      selected: TopicsIconWhite,
    },
    parentId: 'privateAdvertising',
  },
  {
    display_name: 'Attribution',
    component: Attribution,
    id: 'attribution',
    icons: {
      default: AttributionIcon,
      selected: AttributionIconWhite,
    },
    parentId: 'privateAdvertising',
  },
  {
    display_name: 'Tracking Protection',
    component: AntiCovertTracking,
    id: 'antiCovertTracking',
    icons: {
      default: AntiCovertTrackingIcon,
      selected: AntiCovertTrackingIconWhite,
    },
    parentId: 'privacySandbox',
    hasChildren: true,
  },
  {
    display_name: 'Bounce Tracking',
    component: BounceTracking,
    id: 'bounceTracking',
    icons: {
      default: BounceTrackingIcon,
      selected: BounceTrackingIconWhite,
    },
    parentId: 'antiCovertTracking',
  },
  {
    display_name: 'Fingerprinting',
    component: Fingerprinting,
    id: 'fingerprinting',
    icons: {
      default: FingerPrintingIcon,
      selected: FingerPrintingIconWhite,
    },
    parentId: 'antiCovertTracking',
  },
];

export default TABS;

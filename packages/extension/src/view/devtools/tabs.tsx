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
import React from 'react';
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
  type SidebarItems,
  InfoIcon,
  SIDEBAR_ITEMS_KEYS,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import SettingsTab from '../../../../../assets/icons/settings-tab.svg';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import SettingsTabWhite from '../../../../../assets/icons/settings-tab-white.svg';
import {
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
  Settings,
  FacilitatedTesting,
} from './components';

const TABS: SidebarItems = {
  [SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX]: {
    title: 'Privacy Sandbox',
    panel: () => <PrivacySandbox />,
    icon: () => <PrivacySandboxIcon />,
    selectedIcon: () => <PrivacySandboxIconWhite />,
    dropdownOpen: true,
    children: {
      [SIDEBAR_ITEMS_KEYS.COOKIES]: {
        title: 'Cookies',
        icon: () => <CookieIcon />,
        selectedIcon: () => <CookieIconWhite />,
        children: {},
        dropdownOpen: true,
      },
      [SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES]: {
        title: 'Site Boundaries',
        panel: () => <SiteBoundaries />,
        icon: () => <SiteBoundariesIcon />,
        selectedIcon: () => <SiteBoundariesIconWhite />,
        children: {
          [SIDEBAR_ITEMS_KEYS.CHIPS]: {
            title: 'CHIPS',
            panel: () => <Chips />,
            icon: () => <ChipsIcon />,
            selectedIcon: () => <ChipsIconWhite />,
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS]: {
            title: 'Related Website Sets',
            panel: () => <RelatedWebsiteSets />,
            icon: () => <RelatedWebsiteSetsIcon />,
            selectedIcon: () => <RelatedWebsiteSetsIconWhite />,
            children: {},
          },
        },
      },
      [SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING]: {
        title: 'Private Advertising',
        panel: () => <PrivateAdvertising />,
        icon: () => <PrivateAdvertisingIcon />,
        selectedIcon: () => <PrivateAdvertisingIconWhite />,
        children: {
          [SIDEBAR_ITEMS_KEYS.TOPICS]: {
            title: 'Topics',
            panel: () => <Topics />,
            icon: () => <TopicsIcon />,
            selectedIcon: () => <TopicsIconWhite />,
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.ATTRIBUTION]: {
            title: 'Attribution',
            panel: () => <Attribution />,
            icon: () => <AttributionIcon />,
            selectedIcon: () => <AttributionIconWhite />,
            children: {},
          },
        },
      },
      [SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING]: {
        title: 'Tracking Protection',
        panel: () => <AntiCovertTracking />,
        icon: () => <AntiCovertTrackingIcon />,
        selectedIcon: () => <AntiCovertTrackingIconWhite />,
        children: {
          [SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING]: {
            title: 'Bounce Tracking',
            panel: () => <BounceTracking />,
            icon: () => <BounceTrackingIcon />,
            selectedIcon: () => <BounceTrackingIconWhite />,
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.FINGERPRINTING]: {
            title: 'Fingerprinting',
            panel: () => <Fingerprinting />,
            icon: () => <FingerPrintingIcon />,
            selectedIcon: () => <FingerPrintingIconWhite />,
            children: {},
          },
        },
      },
    },
  },
  [SIDEBAR_ITEMS_KEYS.FACILITATED_TESTING]: {
    title: 'Facilitated Testing',
    panel: () => <FacilitatedTesting />,
    icon: () => <InfoIcon className="fill-gray" />,
    selectedIcon: () => <InfoIcon className="fill-white" />,
    dropdownOpen: false,
    children: {},
  },
  [SIDEBAR_ITEMS_KEYS.SETTINGS]: {
    title: 'Settings',
    panel: () => <Settings />,
    icon: () => <SettingsTab />,
    selectedIcon: () => <SettingsTabWhite />,
    dropdownOpen: false,
    children: {},
  },
};

export default TABS;

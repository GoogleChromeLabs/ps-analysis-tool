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
  privacySandbox: {
    title: 'Privacy Sandbox',
    panel: <PrivacySandbox />,
    icon: <PrivacySandboxIcon />,
    selectedIcon: <PrivacySandboxIconWhite />,
    dropdownOpen: true,
    children: {
      cookies: {
        title: 'Cookies',
        icon: <CookieIcon />,
        selectedIcon: <CookieIconWhite />,
        children: {},
        dropdownOpen: true,
      },
      siteBoundaries: {
        title: 'Site Boundaries',
        panel: <SiteBoundaries />,
        icon: <SiteBoundariesIcon />,
        selectedIcon: <SiteBoundariesIconWhite />,
        children: {
          chips: {
            title: 'CHIPS',
            panel: <Chips />,
            icon: <ChipsIcon />,
            selectedIcon: <ChipsIconWhite />,
            children: {},
          },
          relatedWebsiteSets: {
            title: 'Related Website Sets',
            panel: <RelatedWebsiteSets />,
            icon: <RelatedWebsiteSetsIcon />,
            selectedIcon: <RelatedWebsiteSetsIconWhite />,
            children: {},
          },
        },
      },
      privateAdvertising: {
        title: 'Private Advertising',
        panel: <PrivateAdvertising />,
        icon: <PrivateAdvertisingIcon />,
        selectedIcon: <PrivateAdvertisingIconWhite />,
        children: {
          topics: {
            title: 'Topics',
            panel: <Topics />,
            icon: <TopicsIcon />,
            selectedIcon: <TopicsIconWhite />,
            children: {},
          },
          attribution: {
            title: 'Attribution',
            panel: <Attribution />,
            icon: <AttributionIcon />,
            selectedIcon: <AttributionIconWhite />,
            children: {},
          },
        },
      },
      antiCovertTracking: {
        title: 'Tracking Protection',
        panel: <AntiCovertTracking />,
        icon: <AntiCovertTrackingIcon />,
        selectedIcon: <AntiCovertTrackingIconWhite />,
        children: {
          bounceTracking: {
            title: 'Bounce Tracking',
            panel: <BounceTracking />,
            icon: <BounceTrackingIcon />,
            selectedIcon: <BounceTrackingIconWhite />,
            children: {},
          },
          fingerprinting: {
            title: 'Fingerprinting',
            panel: <Fingerprinting />,
            icon: <FingerPrintingIcon />,
            selectedIcon: <FingerPrintingIconWhite />,
            children: {},
          },
        },
      },
    },
  },
  facilitatedTesting: {
    title: 'Facilitated Testing',
    panel: <FacilitatedTesting />,
    icon: <InfoIcon className="fill-gray" />,
    selectedIcon: <InfoIcon className="fill-white" />,
    dropdownOpen: false,
    children: {},
  },
  settings: {
    title: 'Settings',
    panel: <Settings />,
    icon: <SettingsTab />,
    selectedIcon: <SettingsTabWhite />,
    dropdownOpen: false,
    children: {},
  },
};

export default TABS;

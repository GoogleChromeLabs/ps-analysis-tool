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
  type SidebarItems,
  InfoIcon,
  SIDEBAR_ITEMS_KEYS,
  GroupsIcon,
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
import ProtectedAudience from './components/privateAdvertising/protectedAudience';

const TABS: SidebarItems = {
  [SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX]: {
    title: 'Privacy Sandbox',
    panel: {
      Element: PrivacySandbox,
    },
    icon: {
      Element: PrivacySandboxIcon,
    },
    selectedIcon: {
      Element: PrivacySandboxIconWhite,
    },
    dropdownOpen: true,
    children: {
      [SIDEBAR_ITEMS_KEYS.COOKIES]: {
        title: 'Cookies',
        icon: {
          Element: CookieIcon,
        },
        selectedIcon: {
          Element: CookieIconWhite,
        },
        children: {},
        dropdownOpen: true,
      },
      [SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES]: {
        title: 'Site Boundaries',
        panel: {
          Element: SiteBoundaries,
        },
        icon: {
          Element: SiteBoundariesIcon,
        },
        selectedIcon: {
          Element: SiteBoundariesIconWhite,
        },
        children: {
          [SIDEBAR_ITEMS_KEYS.CHIPS]: {
            title: 'CHIPS',
            panel: {
              Element: Chips,
            },
            icon: {
              Element: ChipsIcon,
            },
            selectedIcon: {
              Element: ChipsIconWhite,
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS]: {
            title: 'Related Website Sets',
            panel: {
              Element: RelatedWebsiteSets,
            },
            icon: {
              Element: RelatedWebsiteSetsIcon,
            },
            selectedIcon: {
              Element: RelatedWebsiteSetsIconWhite,
            },
            children: {},
          },
        },
      },
      [SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING]: {
        title: 'Private Advertising',
        panel: {
          Element: PrivateAdvertising,
        },
        icon: {
          Element: PrivateAdvertisingIcon,
        },
        selectedIcon: {
          Element: PrivateAdvertisingIconWhite,
        },
        children: {
          [SIDEBAR_ITEMS_KEYS.TOPICS]: {
            title: 'Topics',
            panel: {
              Element: Topics,
            },
            icon: {
              Element: TopicsIcon,
            },
            selectedIcon: {
              Element: TopicsIconWhite,
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.ATTRIBUTION]: {
            title: 'Attribution',
            panel: {
              Element: Attribution,
            },
            icon: {
              Element: AttributionIcon,
            },
            selectedIcon: {
              Element: AttributionIconWhite,
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE]: {
            title: 'Protected Audience',
            panel: {
              Element: ProtectedAudience,
            },
            icon: {
              Element: GroupsIcon,
              props: {
                className: 'fill-gray',
              },
            },
            selectedIcon: {
              Element: GroupsIcon,
              props: {
                className: 'fill-white',
              },
            },
            children: {},
          },
        },
      },
      [SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING]: {
        title: 'Tracking Protection',
        panel: {
          Element: AntiCovertTracking,
        },
        icon: {
          Element: AntiCovertTrackingIcon,
        },
        selectedIcon: {
          Element: AntiCovertTrackingIconWhite,
        },
        children: {
          [SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING]: {
            title: 'Bounce Tracking',
            panel: {
              Element: BounceTracking,
            },
            icon: {
              Element: BounceTrackingIcon,
            },
            selectedIcon: {
              Element: BounceTrackingIconWhite,
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.FINGERPRINTING]: {
            title: 'Fingerprinting',
            panel: {
              Element: Fingerprinting,
            },
            icon: {
              Element: FingerPrintingIcon,
            },
            selectedIcon: {
              Element: FingerPrintingIconWhite,
            },
            children: {},
          },
        },
      },
    },
  },
  [SIDEBAR_ITEMS_KEYS.FACILITATED_TESTING]: {
    title: 'Facilitated Testing',
    panel: {
      Element: FacilitatedTesting,
    },
    icon: {
      Element: InfoIcon,
      props: {
        className: 'fill-gray',
      },
    },
    selectedIcon: {
      Element: InfoIcon,
      props: {
        className: 'fill-white',
      },
    },
    dropdownOpen: false,
    children: {},
  },
  [SIDEBAR_ITEMS_KEYS.SETTINGS]: {
    title: 'Settings',
    panel: {
      Element: Settings,
    },
    icon: {
      Element: SettingsTab,
    },
    selectedIcon: {
      Element: SettingsTabWhite,
    },
    dropdownOpen: false,
    children: {},
  },
};

export default TABS;

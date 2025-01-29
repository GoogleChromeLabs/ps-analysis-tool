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
  SIDEBAR_ITEMS_KEYS,
  GroupsIcon,
  DashboardIcon,
  DashboardIconWhite,
  WikiIcon,
  WikiIconWhite,
  type CollapsedSidebarItems,
  Settings as SettingsIcon,
  WebStoriesIcon,
  WebStoriesIconWhite,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import PrivateAggregationicon from '../../../../../assets/icons/private-aggregation.svg';

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
  Wiki,
  Settings,
  ProtectedAudience,
  PrivateAggregation,
  Dashboard,
  WebStories,
} from './components';

const TABS: SidebarItems = {
  [SIDEBAR_ITEMS_KEYS.PRIVACY_SANDBOX]: {
    title: () => 'Privacy Sandbox',
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
        title: () => I18n.getMessage('cookies'),
        icon: {
          Element: CookieIcon,
        },
        selectedIcon: {
          Element: CookieIconWhite,
        },
        children: {},
        dropdownOpen: false,
      },
      [SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES]: {
        title: () => I18n.getMessage('siteBoundaries'),
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
            title: () => I18n.getMessage('chips'),
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
            title: () => I18n.getMessage('rws'),
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
        title: () => I18n.getMessage('privateAdvertising'),
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
            title: () => I18n.getMessage('topics'),
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
          [SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING]: {
            title: () => I18n.getMessage('attributionReporting'),
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
          [SIDEBAR_ITEMS_KEYS.PRIVATE_AGGREGATION]: {
            title: 'Private Aggregation',
            panel: {
              Element: PrivateAggregation,
            },
            icon: {
              Element: PrivateAggregationicon,
              props: {
                className: 'fill-gray',
              },
            },
            selectedIcon: {
              Element: PrivateAggregationicon,
              props: {
                className: 'fill-white',
              },
            },
            children: {},
          },
        },
      },
      [SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING]: {
        title: () => I18n.getMessage('trackingProtection'),
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
            title: () => I18n.getMessage('bounceTracking'),
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
            title: () => I18n.getMessage('fingerprinting'),
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
    addDivider: true,
  },
  [SIDEBAR_ITEMS_KEYS.DASHBOARD]: {
    title: () => 'Dashboard',
    panel: {
      Element: Dashboard,
    },
    icon: {
      Element: DashboardIcon,
    },
    selectedIcon: {
      Element: DashboardIconWhite,
    },
    dropdownOpen: false,
    children: {},
    containerClassName: 'h-6',
  },
  [SIDEBAR_ITEMS_KEYS.EXPLORABLE_EXPLANATIONS]: {
    title: () => 'Stories',
    panel: {
      Element: WebStories,
    },
    icon: {
      Element: WebStoriesIcon,
    },
    selectedIcon: {
      Element: WebStoriesIconWhite,
    },
    dropdownOpen: false,
    children: {},
    containerClassName: 'h-6',
  },
  [SIDEBAR_ITEMS_KEYS.EXPLORABLE_EXPLANATIONS]: {
    title: () => 'Stories',
    panel: {
      Element: WebStories,
    },
    icon: {
      Element: WebStoriesIcon,
    },
    selectedIcon: {
      Element: WebStoriesIconWhite,
    },
    dropdownOpen: false,
    children: {},
  },
  [SIDEBAR_ITEMS_KEYS.WIKI]: {
    title: () => I18n.getMessage('wiki'),
    panel: {
      Element: Wiki,
    },
    icon: {
      Element: WikiIcon,
    },
    selectedIcon: {
      Element: WikiIconWhite,
    },
    dropdownOpen: false,
    children: {},
    addSpacer: true,
    containerClassName: 'h-6',
  },
  [SIDEBAR_ITEMS_KEYS.SETTINGS]: {
    title: () => I18n.getMessage('settings'),
    panel: {
      Element: Settings,
    },
    icon: {
      Element: SettingsIcon,
      props: {
        className: 'fill-gray w-4 h-4',
      },
    },
    selectedIcon: {
      Element: SettingsIcon,
      props: {
        className: 'fill-white w-4 h-4',
      },
    },
    dropdownOpen: false,
    children: {},
    containerClassName: 'h-6 mb-2',
  },
};

export default TABS;

export const collapsedSidebarData: CollapsedSidebarItems = {
  footerElements: {
    [SIDEBAR_ITEMS_KEYS.SETTINGS]: {
      icon: {
        Element: SettingsIcon,
        props: {
          className: 'fill-granite-gray dark:fill-bright-gray',
        },
      },
      title: () => I18n.getMessage('settings'),
    },
  },
};

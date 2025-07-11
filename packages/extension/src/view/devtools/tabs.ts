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
  SiteBoundariesIcon,
  ChipsIcon,
  ChipsIconWhite,
  RelatedWebsiteSetsIcon,
  PrivateAdvertisingIcon,
  PrivacyProtectionIcon,
  AttributionIcon,
  BounceTrackingIcon,
  BounceTrackingIconWhite,
  UserAgentReductionIcon,
  UserAgentReductionIconWhite,
  TopicsIcon,
  PrivacySandboxIcon,
  PrivacySandboxIconWhite,
  type SidebarItems,
  SIDEBAR_ITEMS_KEYS,
  GroupsIcon,
  WikiIcon,
  type CollapsedSidebarItems,
  Settings as SettingsIcon,
  WebStoriesIcon,
  WebStoriesIconWhite,
  Help,
  LearningIcon,
  DevGuideIcon,
  TokenIcon,
  FederatedIcon,
  StorageIcon,
  ProtectionIcon,
  SiteBoundariesIconWhite,
  DemosIcon,
  IncognitoIcon,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { addUTMParams } from '@google-psat/common';

/**
 * Internal dependencies.
 */
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import PrivateAggregationicon from '../../../../../assets/icons/private-aggregation.svg?react';

import {
  SiteBoundaries,
  Chips,
  RelatedWebsiteSets,
  PrivateAdvertising,
  PrivacyProtection,
  Topics,
  AttributionReporting,
  BounceTracking,
  UserAgentReduction,
  PrivacySandbox,
  Wiki,
  Settings,
  ProtectedAudience,
  PrivateAggregation,
  WebStories,
  Learning,
  DevSite,
  StorageAccess,
  FederatedCredential,
  IPProtection,
  PrivateStateTokens,
} from './pages';
import HelpCenter from './pages/learning/helpCenter';
import Demos from './pages/learning/demos';

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
      [SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES]: {
        title: () => I18n.getMessage('siteBoundaries'),
        panel: {
          Element: SiteBoundaries,
        },
        icon: {
          Element: SiteBoundariesIcon,
          props: {
            className: '[&_path]:fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: SiteBoundariesIconWhite,
          props: {
            className: '[&_path]:fill-bright-gray',
          },
        },
        children: {
          [SIDEBAR_ITEMS_KEYS.COOKIES]: {
            title: () => I18n.getMessage('cookies'),
            icon: {
              Element: CookieIcon,
              props: {
                className: '[&_path]:fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: CookieIcon,
              props: {
                className: '[&_path]:fill-bright-gray',
              },
            },
            children: {},
            dropdownOpen: false,
          },
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
          [SIDEBAR_ITEMS_KEYS.STORAGE_ACCESS]: {
            title: () => I18n.getMessage('storageAccessAPI'),
            panel: {
              Element: StorageAccess,
            },
            icon: {
              Element: StorageIcon,
              props: {
                className: 'fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: StorageIcon,
              props: {
                className: 'fill-bright-gray',
              },
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
              props: {
                className:
                  '[&_path]:stroke-granite-gray [&_path]:fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: RelatedWebsiteSetsIcon,
              props: {
                className:
                  '[&_path]:stroke-bright-gray [&_path]:fill-bright-gray',
              },
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.FEDERATED_CREDENTIAL]: {
            title: () => 'FedCM',
            panel: {
              Element: FederatedCredential,
            },
            icon: {
              Element: FederatedIcon,
              props: {
                className: 'fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: FederatedIcon,
              props: {
                className: 'fill-bright-gray',
              },
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
          props: {
            className: '[&_path]:fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: PrivateAdvertisingIcon,
          props: {
            className: '[&_path]:fill-bright-gray',
          },
        },
        children: {
          [SIDEBAR_ITEMS_KEYS.TOPICS]: {
            title: () => I18n.getMessage('topics'),
            panel: {
              Element: Topics,
            },
            icon: {
              Element: TopicsIcon,
              props: {
                className: '[&_path]:fill-granite-gray h-4',
              },
            },
            selectedIcon: {
              Element: TopicsIcon,
              props: {
                className: '[&_path]:fill-bright-gray h-4',
              },
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
                className: 'fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: GroupsIcon,
              props: {
                className: 'fill-bright-gray',
              },
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.ATTRIBUTION_REPORTING]: {
            title: () => I18n.getMessage('attributionReporting'),
            panel: {
              Element: AttributionReporting,
            },
            icon: {
              Element: AttributionIcon,
              props: {
                className: '[&_path]:fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: AttributionIcon,
              props: {
                className: '[&_path]:fill-bright-gray',
              },
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
                className: 'fill-granite-gray',
              },
            },
            selectedIcon: {
              Element: PrivateAggregationicon,
              props: {
                className: 'fill-bright-gray',
              },
            },
            children: {},
          },
        },
      },
      [SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING]: {
        title: () => 'Privacy Protection',
        panel: {
          Element: PrivacyProtection,
        },
        icon: {
          Element: PrivacyProtectionIcon,
          props: {
            className: '[&_path]:fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: PrivacyProtectionIcon,
          props: {
            className: '[&_path]:fill-bright-gray',
          },
        },
        children: {
          [SIDEBAR_ITEMS_KEYS.IP_PROTECTION]: {
            title: () => I18n.getMessage('ipProtection'),
            panel: {
              Element: IPProtection,
            },
            icon: {
              Element: ProtectionIcon,
              props: {
                className: 'fill-granite-gray relative right-[3px]',
              },
            },
            selectedIcon: {
              Element: ProtectionIcon,
              props: {
                className: 'fill-bright-gray relative right-[3px]',
              },
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING]: {
            title: () => I18n.getMessage('bounceTracking'),
            panel: {
              Element: BounceTracking,
            },
            icon: {
              Element: BounceTrackingIcon,
              props: {
                className: 'relative top-[2px]',
              },
            },
            selectedIcon: {
              Element: BounceTrackingIconWhite,
              props: {
                className: 'relative top-[2px]',
              },
            },
            children: {},
          },
          [SIDEBAR_ITEMS_KEYS.FINGERPRINTING]: {
            title: () => 'User Agent Reduction',
            panel: {
              Element: UserAgentReduction,
            },
            icon: {
              Element: UserAgentReductionIcon,
              props: {
                className: 'relative top-[2px]',
              },
            },
            selectedIcon: {
              Element: UserAgentReductionIconWhite,
              props: {
                className: 'relative top-[2px]',
              },
            },
            children: {},
          },

          [SIDEBAR_ITEMS_KEYS.PRIVATE_STATE_TOKENS]: {
            title: () => I18n.getMessage('privateStateTokens'),
            panel: {
              Element: PrivateStateTokens,
            },
            icon: {
              Element: TokenIcon,
              props: {
                className: 'fill-granite-gray relative right-[3px]',
              },
            },
            selectedIcon: {
              Element: TokenIcon,
              props: {
                className: 'fill-bright-gray relative right-[3px]',
              },
            },
            children: {},
          },
        },
      },
    },
    addDivider: true,
  },
  [SIDEBAR_ITEMS_KEYS.LEARNING]: {
    title: () => 'Learning',
    panel: {
      Element: Learning,
    },
    icon: {
      Element: LearningIcon,
      props: {
        className: 'fill-granite-gray',
      },
    },
    selectedIcon: {
      Element: LearningIcon,
      props: {
        className: 'fill-bright-gray',
      },
    },
    dropdownOpen: true,
    children: {
      [SIDEBAR_ITEMS_KEYS.DEV_SITE]: {
        title: () => 'Dev Site',
        panel: {
          Element: DevSite,
          skipPanelDisplay: true,
          href: addUTMParams('https://developers.google.com/privacy-sandbox'),
        },
        icon: {
          Element: DevGuideIcon,
          props: {
            className: 'fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: DevGuideIcon,
          props: {
            className: 'fill-bright-gray',
          },
        },
        dropdownOpen: false,
        children: {},
        containerClassName: 'h-6',
      },
      [SIDEBAR_ITEMS_KEYS.HELP_CENTER]: {
        title: () => 'Help Center',
        panel: {
          Element: HelpCenter,
          skipPanelDisplay: true,
          href: addUTMParams('https://support.google.com/privacysandbox'),
        },
        icon: {
          Element: Help,
          props: {
            className: 'fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: Help,
          props: {
            className: 'fill-bright-gray',
          },
        },
        dropdownOpen: false,
        children: {},
        containerClassName: 'h-6',
      },
      [SIDEBAR_ITEMS_KEYS.STORIES]: {
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
      [SIDEBAR_ITEMS_KEYS.DEMOS]: {
        title: () => 'Demos',
        panel: {
          Element: Demos,
          skipPanelDisplay: true,
          href: 'https://domain-aaa.com/',
        },
        icon: {
          Element: DemosIcon,
          props: {
            className: 'fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: DemosIcon,
          props: {
            className: 'fill-bright-gray',
          },
        },
        dropdownOpen: false,
        children: {},
        containerClassName: 'h-6',
      },
      [SIDEBAR_ITEMS_KEYS.WIKI]: {
        title: () => 'PSAT Wiki',
        panel: {
          Element: Wiki,
          skipPanelDisplay: true,
          href: 'https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki',
        },
        icon: {
          Element: WikiIcon,
          props: {
            className: 'fill-granite-gray',
          },
        },
        selectedIcon: {
          Element: WikiIcon,
          props: {
            className: 'fill-bright-gray',
          },
        },
        dropdownOpen: false,
        children: {},
        addSpacer: false,
        containerClassName: 'h-6',
      },
    },
    containerClassName: 'h-6',
    addDivider: true,
  },
  [SIDEBAR_ITEMS_KEYS.SETTINGS]: {
    title: () => I18n.getMessage('settings'),
    panel: {
      Element: Settings,
    },
    icon: {
      Element: SettingsIcon,
      props: {
        className: 'fill-granite-gray w-4 h-4',
      },
    },
    selectedIcon: {
      Element: SettingsIcon,
      props: {
        className: 'fill-bright-gray w-4 h-4',
      },
    },
    dropdownOpen: false,
    addSpacer: false,
    children: {},
    containerClassName: 'h-6',
    addDivider: true,
  },
  [SIDEBAR_ITEMS_KEYS.OPEN_INCOGNITO_TAB]: {
    title: 'Open in Incognito',
    panel: {
      skipPanelDisplay: true,
      cta: () => null,
    },
    icon: {
      Element: IncognitoIcon,
      props: {
        className: 'fill-granite-gray w-4 h-4',
      },
    },
    selectedIcon: {
      Element: IncognitoIcon,
      props: {
        className: 'fill-bright-gray w-4 h-4',
      },
    },
    dropdownOpen: false,
    addSpacer: true,
    children: {},
    containerClassName: 'h-6 mb-2',
  },
};

export default TABS;

export const collapsedSidebarData: CollapsedSidebarItems = {
  footerElements: {},
};

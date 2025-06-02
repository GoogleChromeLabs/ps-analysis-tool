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
/**
 * External dependencies
 */
import {
  Buildings,
  DoubleUser,
  FourSquares,
  Person,
  Ruler,
  Server,
  Settings,
  type SidebarItems,
} from '@google-psat/design-system';
import { useMemo } from 'react';
/**
 * Internal dependencies
 */
import PrebidConfig from '../components/prebidConfig';
import InstalledModules from '../components/installedModules';
import PriceGranularity from '../components/priceGranularity';
import JsonViewerWrapper from '../components/jsonViewerWrapper';
import ConsentManagement from '../components/consentManagement';
import UserIds from '../components/userIds';

const useConfigContainer = (
  config: PrebidConfig,
  installedModules: string[]
) => {
  const sidebarData = useMemo<SidebarItems>(() => {
    const baseSidebarItems: SidebarItems = {
      prebidConfig: {
        title: 'Prebid Config',
        icon: {
          Element: Settings,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: Settings,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: PrebidConfig,
          props: {
            configObject: {
              'Bidder Timeout': config?.bidderTimeout,
              'Bidder Sequence': config?.bidderSequence,
              'Max Nested Frames': config?.maxNestedIframes,
              'Max Bid': config?.maxBid,
              'Use Bid Cache': config?.useBidCache,
              'Enable SendAllBids': config?.enableSendAllBids,
            },
          },
        },
        children: {},
      },
      pricegGanularity: {
        title: 'Price Granularity',
        icon: {
          Element: Ruler,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: Ruler,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: PriceGranularity,
          props: {
            priceGranularity: config?.priceGranularity,
            customBucket: config?.customPriceBucket ?? {},
          },
        },
        children: {},
      },
    };

    if (installedModules.length > 0) {
      baseSidebarItems['installedModules'] = {
        title: 'Installed Modules',
        panel: {
          Element: InstalledModules,
          props: {
            installedModules,
          },
        },
        icon: {
          Element: FourSquares,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: FourSquares,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        children: {},
      };
    }

    if (config?.bidderSettings) {
      baseSidebarItems['bidderSettings'] = {
        title: 'Bidder Settings',
        icon: {
          Element: Settings,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: Settings,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.bidderSettings ?? {},
          },
        },
        children: {},
      };
    }

    if (config?.consentManagement) {
      baseSidebarItems['consentManagement'] = {
        title: 'Consent Management',
        icon: {
          Element: Buildings,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: Buildings,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: ConsentManagement,
          props: {
            config: config?.consentManagement ?? {},
          },
        },
        children: {},
      };
    }

    if (config?.userSync?.userIds) {
      baseSidebarItems['userIds'] = {
        title: 'User Ids',
        icon: {
          Element: Person,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: Person,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: UserIds,
          props: {
            config: config?.userSync?.userIds ?? [],
          },
        },
        children: {},
      };
    }

    if (config?.gptPreAuction) {
      baseSidebarItems['gptPreAuction'] = {
        title: 'GPT Pre-Auction Module',
        icon: {
          Element: FourSquares,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: FourSquares,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.gptPreAuction ?? {},
          },
        },
        children: {},
      };
    }

    if (config?.userSync) {
      baseSidebarItems['userSync'] = {
        title: 'User Sync',
        icon: {
          Element: DoubleUser,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: DoubleUser,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.userSync ?? [],
          },
        },
        children: {},
      };
    }

    if (config?.s2sConfig) {
      baseSidebarItems['prebidServerConfig'] = {
        title: 'Prebid Server Config',
        icon: {
          Element: Server,
          props: {
            className:
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        selectedIcon: {
          Element: Server,
          props: {
            className:
              '[&_path]:fill-white dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.s2sConfig ?? [],
          },
        },
        children: {},
      };
    }
    return baseSidebarItems;
  }, [
    config?.s2sConfig,
    config?.gptPreAuction,
    config?.bidderTimeout,
    config?.bidderSequence,
    config?.maxNestedIframes,
    config?.maxBid,
    config?.useBidCache,
    config?.enableSendAllBids,
    config?.priceGranularity,
    config?.customPriceBucket,
    config?.bidderSettings,
    config?.consentManagement,
    config?.userSync,
    installedModules,
  ]);
  return sidebarData;
};

export default useConfigContainer;

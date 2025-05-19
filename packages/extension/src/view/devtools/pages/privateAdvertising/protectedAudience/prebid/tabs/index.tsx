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
  SidebarProvider,
  type SidebarItems,
} from '@google-psat/design-system';
import React, { useMemo } from 'react';
import PrebidConfig from './components/prebidConfig';
import InstalledModules from './components/installedModules';
import PriceGranularity from './components/priceGranularity';
import JsonViewerWrapper from './components/jsonViewerWrapper';
import ConsentManagement from './components/consentManagement';
import UserIds from './components/userIds';
import ConfigPanel from './container';

type ConfigContainerPanelProps = {
  config: PrebidConfig;
  installedModules: string[];
};

const ConfigContainer = ({
  config,
  installedModules,
}: ConfigContainerPanelProps) => {
  const sidebarData = useMemo<SidebarItems>(
    () => ({
      prebidConfig: {
        title: 'PrebidConfig',
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
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
        dropdownOpen: true,
      },
      installedmodules: {
        title: 'Installed Modules',
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: InstalledModules,
          props: {
            installedModules,
          },
        },
        children: {},
        dropdownOpen: true,
      },
      pricegranularity: {
        title: 'Price Granularity',
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
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
        dropdownOpen: true,
      },
      biddersettings: {
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            bidderSettings: config?.bidderSettings ?? {},
          },
        },
        children: {},
        dropdownOpen: true,
      },
      consentmanagement: {
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: ConsentManagement,
          props: {
            config: config?.consentManagement ?? {},
          },
        },
        children: {},
        dropdownOpen: true,
      },
      userids: {
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: UserIds,
          props: {
            config: config?.userSync?.userIds ?? [],
          },
        },
        children: {},
        dropdownOpen: true,
      },
      gptpreauction: {
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.gptPreAuction ?? {},
          },
        },
        children: {},
        dropdownOpen: true,
      },
      usersync: {
        title: 'UserSync',
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.userSync ?? [],
          },
        },
        children: {},
        dropdownOpen: true,
      },
      prebidServerConfig: {
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
              '[&_path]:fill-granite-gray dark:[&_path]:fill-bright-gray w-4 h-4',
          },
        },
        panel: {
          Element: JsonViewerWrapper,
          props: {
            config: config?.s2sConfig ?? [],
          },
        },
        children: {},
        dropdownOpen: true,
      },
    }),
    [
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
    ]
  );
  return (
    <SidebarProvider
      data={sidebarData}
      defaultSelectedItemKey={Object.keys(sidebarData)?.[0]}
    >
      <ConfigPanel />
    </SidebarProvider>
  );
};

export default ConfigContainer;

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
import { SidebarProvider, type SidebarItems } from '@google-psat/design-system';
import React, { useMemo } from 'react';
import PrebidConfig from './components/prebidConfig';
import InstalledModules from './components/installedModules';
import PriceGranularity from './components/priceGranularity';
import BidderSettings from './components/bidderSettings';
import ConsentManagement from './components/consentManagement';
import UserIds from './components/userIds';
import GPTPreAuction from './components/gptPreAuction';
import UserSync from './components/userSync';
import ConfigPanel from './container';

type ConfigContainerPanelProps = {
  config: PrebidConfig;
};

const ConfigContainer = ({ config }: ConfigContainerPanelProps) => {
  const sidebarData = useMemo<SidebarItems>(
    () => ({
      prebidConfig: {
        title: 'PrebidConfig',
        panel: {
          Element: PrebidConfig,
          props: {
            configObject: {
              'Bidder Timeout': config.bidderTimeout,
              'Bidder Sequence': config.bidderSequence,
              'Max Nested Frames': config.maxNestedIframes,
              'Max Bid': config.maxBid,
              'Use Bid Cache': config.useBidCache,
              'Enable SendAllBids': config.enableSendAllBids,
            },
          },
        },
        children: {},
        dropdownOpen: true,
      },
      installedmodules: {
        title: 'Installed Modules',
        panel: {
          Element: InstalledModules,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
      pricegranularity: {
        title: 'Price Granularity',
        panel: {
          Element: PriceGranularity,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
      biddersettings: {
        title: 'Bidder Settings',
        panel: {
          Element: BidderSettings,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
      consentmanagement: {
        title: 'Consent Management',
        panel: {
          Element: ConsentManagement,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
      userids: {
        title: 'User Ids',
        panel: {
          Element: UserIds,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
      gptpreauction: {
        title: 'GPT Pre-Auction Module',
        panel: {
          Element: GPTPreAuction,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
      usersync: {
        title: 'UserSync',
        panel: {
          Element: UserSync,
          props: {},
        },
        children: {},
        dropdownOpen: true,
      },
    }),
    [config]
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

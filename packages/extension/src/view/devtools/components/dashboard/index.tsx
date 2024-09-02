/*
 * Copyright 2024 Google LLC
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
 * External dependencies.
 */
import React from 'react';
import {
  DashboardIcon,
  GroupsIcon,
  CookieIcon,
  RelatedWebsiteSetsIcon,
  AntiCovertTrackingIcon,
  SiteBoundariesIcon,
  useSidebar,
  SIDEBAR_ITEMS_KEYS,
} from '@google-psat/design-system';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
// @ts-ignore - To ignore auto fixing path with package name.
// eslint-disable-next-line import/no-relative-packages
import PrivateAggregationIcon from '../../../../../../../assets/icons/private-aggregation.svg';

const PINNED_ITEMS = [
  {
    name: 'Protected Audience',
    icon: GroupsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
  },
  {
    name: 'Cookies',
    icon: CookieIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
  },
  {
    name: 'Related Website Sets',
    icon: RelatedWebsiteSetsIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
  },
];

const FEATURE_LIST = [
  {
    name: 'Cookies',
    icon: CookieIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.COOKIES,
    description:
      'Privacy Sandbox technologies enhance user privacy by allowing ad selection and measurement without individual tracking or third-party cookies.',
  },
  {
    name: 'Private Advertising',
    icon: PrivateAggregationIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_ADVERTISING,
    description:
      'Enable your critical advertising use cases without relying on cross-site tracking via APIs providing accurate relevance information and and measurement data for digital ads.',
    colorClasses: {
      heading: 'text-bright-navy-blue',
    },
    buttons: [
      {
        name: 'Topics',
        sidebarKey: SIDEBAR_ITEMS_KEYS.TOPICS,
      },
      {
        name: 'Attribution',
        sidebarKey: SIDEBAR_ITEMS_KEYS.ATTRIBUTION,
      },
      {
        name: 'Protected Audience',
        sidebarKey: SIDEBAR_ITEMS_KEYS.PROTECTED_AUDIENCE,
      },
      {
        name: 'Private Aggregation',
        sidebarKey: SIDEBAR_ITEMS_KEYS.PRIVATE_AGGREGATION,
      },
    ],
  },
  {
    name: 'Tracking Protection',
    icon: AntiCovertTrackingIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.ANTI_COVERT_TRACKING,
    description:
      'The Privacy Sandbox initiative also includes efforts designed to limit covert tracking, including addressing specific covert tracking techniques such as fingerprinting and network-level tracking.',
    colorClasses: {
      heading: 'text-third-party',
    },
    buttons: [
      {
        name: 'Bounce Tracking',
        sidebarKey: SIDEBAR_ITEMS_KEYS.BOUNCE_TRACKING,
      },
      {
        name: 'Fingerprinting',
        sidebarKey: SIDEBAR_ITEMS_KEYS.FINGERPRINTING,
      },
    ],
  },
  {
    name: 'Site Boundaries',
    icon: SiteBoundariesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.SITE_BOUNDARIES,
    description:
      'Privacy-preserving APIs ensuring that information collected on one site is not automatically shared with another site, unless the user explicitly consents. Privacy-preserving APIs ensuring that information collected on one site is not automatically shared with another site, unless the user explicitly consents.',
    colorClasses: {
      heading: 'text-first-party',
    },
    buttons: [
      {
        name: 'CHIPS',
        sidebarKey: SIDEBAR_ITEMS_KEYS.CHIPS,
      },
      {
        name: 'Related Website Sets',
        sidebarKey: SIDEBAR_ITEMS_KEYS.RELATED_WEBSITE_SETS,
      },
    ],
  },
];

const Dashboard = () => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  return (
    <div
      data-testid="dashboard-content"
      className="h-full w-full text-raisin-black"
    >
      <div className="p-4">
        <header className="flex items-center">
          <DashboardIcon width="22" height="22" className="mr-1.5" />
          <h1 className="text-lg">Dashboard</h1>
        </header>
        <section className="mt-5 border-b border-hex-gray mb-5 pb-5">
          <h3 className="text-sm mb-2">Pinned</h3>
          <div className="flex gap-5">
            {PINNED_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="border border-chinese-silver px-3 py-4 flex gap-2 justify-start rounded flex-1 hover:cursor-pointer hover:bg-light-gray hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                  onClick={() => navigateTo(item.sidebarKey)}
                >
                  <Icon width={20} height={20} />
                  <span className="text-sm">{item.name}</span>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <h3 className="text-sm mb-2">Features</h3>
          <div className="grid grid-cols-3 gap-5">
            {FEATURE_LIST.map((item) => {
              const Icon = item.icon;
              const headingClasses = classNames(
                'text-sm',
                item?.colorClasses?.heading ? item?.colorClasses?.heading : ''
              );

              return (
                <div
                  key={item.name}
                  className="border border-chinese-silver px-3 py-4 rounded hover:cursor-pointer hover:bg-light-gray hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                  onClick={() => navigateTo(item.sidebarKey)}
                >
                  <div className="flex gap-2 justify-start mb-3">
                    <Icon width={20} height={20} />
                    <h4 className={headingClasses}>{item.name}</h4>
                  </div>
                  <p>{item.description}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                    {item.buttons &&
                      item.buttons.map((button) => (
                        <button
                          className="bg-cultured-grey py-1 px-4 rounded border border-dark-grey text-xs hover:bg-light-gray hover:border-american-silver"
                          key={button.name}
                          onClick={() => navigateTo(button.sidebarKey)}
                        >
                          {button.name}
                        </button>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

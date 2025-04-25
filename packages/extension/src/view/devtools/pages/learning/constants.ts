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
import type { FunctionComponent, SVGProps } from 'react';
import {
  SIDEBAR_ITEMS_KEYS,
  PSHelpCenterIcon,
  PSDevSiteIcon,
  PSWikiIcon,
  PSStoriesIcon,
  PSDemosIcon,
} from '@google-psat/design-system';

export interface FeaturedItems {
  name: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  sidebarKey: SIDEBAR_ITEMS_KEYS;
  title?: string;
  description: string;
  colorClasses?: {
    heading: string;
  };
}

export const FEATURED_ITEMS = [
  {
    name: 'Help Center',
    icon: PSHelpCenterIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.HELP_CENTER,
    title: 'Need help with Privacy Sandbox?',
    description:
      'The Privacy Sandbox Help Center is your comprehensive resource for finding quick answers and effective learning. Explore a wealth of information, FAQs, and guidance directly in the current browser tab to the left.',
  },
  {
    name: 'Dev Site',
    icon: PSDevSiteIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEV_SITE,
    title: 'Ready to start developing with the Privacy Sandbox?',
    description:
      'Privacy Sandbox Dev Site is your central hub for all developer resources.  Dive deep into comprehensive documentation covering every aspect of the Privacy Sandbox, from foundational concepts to advanced API usage.  Go on exploring in the current browser tab to the left.',
    colorClasses: {
      heading: 'text-red-700',
    },
  },
  {
    name: 'Stories',
    icon: PSStoriesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.STORIES,
    description:
      'Explore interactive web stories to grasp the fundamental concepts of the Privacy Sandbox and its impact on the web.',
    colorClasses: {
      heading: 'text-yellow-500',
    },
  },
  {
    name: 'Demos',
    icon: PSDemosIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEMOS,
    title: 'Want to see Privacy Sandbox APIs in action?',
    description:
      'Explore and test Privacy Sandbox APIs firsthand using the PSAT extension. Gain hands-on insights by interacting with real-world scenarios and experimenting directly within your browser.',
    colorClasses: {
      heading: 'text-green-700',
    },
  },
  {
    name: 'Wiki',
    icon: PSWikiIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.WIKI,
    title: 'Looking for in-depth guidance on using PSAT?',
    description:
      "The PSAT Wiki Page is your dedicated resource where you'll find detailed explanations of the extension's features, practical guidance on how to leverage its tools effectively, and answers to frequently asked questions about its functionality.  Explore the PSAT Wiki in the current browser tab to the left of PSAT.",
    colorClasses: {
      heading: 'text-blue-600',
    },
  },
];

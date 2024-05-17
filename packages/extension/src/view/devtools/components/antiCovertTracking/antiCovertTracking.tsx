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
 * External Dependencies
 */
import React from 'react';
import { ContentPanel, LandingPage } from '@ps-analysis-tool/design-system';

const content = [
  {
    title: 'IP Protection',
    description:
      "IP Protection is a proposal to avoid sharing a user's real IP address with third parties.",
    url: 'https://developers.google.com/privacy-sandbox/protections/ip-protection',
  },
  {
    title: 'Bounce Tracking Mitigations',
    description:
      'Reduce or eliminate the ability of bounce tracking to recognize people across contexts.',
    url: 'https://developers.google.com/privacy-sandbox/protections/bounce-tracking-mitigations',
  },
  {
    title: 'Privacy Budget',
    description:
      'This proposal suggests a limit to the amount of individual user data that can be exposed to sites, so that in total it is insufficient to track and identify individuals.',
    url: 'https://developers.google.com/privacy-sandbox/protections/privacy-budget',
  },
  {
    title: 'User-Agent Reduction',
    description:
      'Minimize the identifying information shared in the User-Agent string, which may be used for passive fingerprinting.',
    url: 'https://developers.google.com/privacy-sandbox/protections/user-agent',
  },
  {
    title: 'Private State Tokens',
    description:
      "Enable trust in a user's authenticity to be conveyed from one context to another, to help sites combat fraud and distinguish bots from real humans—without passive tracking.",
    url: 'https://developers.google.com/privacy-sandbox/protections/private-state-tokens',
  },
];

const AntiCovertTracking = () => {
  return (
    <LandingPage
      title="Tracking Protection"
      extraClasses="min-h-[78vh] w-full"
      contentPanel={
        <ContentPanel
          title="The Privacy Sandbox initiative also includes efforts designed to limit covert tracking, including addressing specific covert tracking techniques such as fingerprinting and network-level tracking."
          content={content}
          counterStyles="bg-yellow-500"
          titleStyles="text-yellow-500"
        />
      }
    />
  );
};

export default AntiCovertTracking;

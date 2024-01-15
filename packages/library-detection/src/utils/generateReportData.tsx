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

import React from 'react';

/**
 * Internal dependencies.
 */
import type {
  DeprecatedSignatureDetectedReportItem,
  DetectedSignature,
} from '../types';

const mockCirclePieChartData = {
  title: 'Deprecated GSI features found', // Circle Pie Chart title
  centerCount: 0, // Total number of requests and scripts related to Google Services
  data: [
    {
      count: 0, // Number of requests and scripts related to a particular google service.
      color: '#FFA500',
    },
    {
      count: 0,
      color: '#EC7159',
    },
  ],
};

const mockGSIReportItemData = {
  title: 'Google Services Audit',
  accordion: [
    {
      count: 0, // Number of requests and scripts related to this google identity service
      isAffected: true, // Are these requests and scripts being affected
      title: 'Avoid use of deprecated Google Sign-In functionality.', // Google service title
      superTitle: 'Google Sign In Detected',
      superTitleDescription: 'unsupported GSI features found',
      helpUrl:
        'https://developers.google.com/privacy-sandbox/3pcd/guides/identity#federated_identity',
      description: (
        <p>
          The Google Sign-In JavaScript library is{' '}
          <a
            href="https://developers.google.com/identity/sign-in/web/deprecation-and-sunset"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-200 underline"
          >
            deprecated
          </a>{' '}
          and is no longer supported. This report performs a page scan for
          script src elements and JavaScript objects and methods used by the
          deprecated gapi.auth2 module. Review the features in the following
          table and consider migrating to a newer library if necessary.
        </p>
      ), // Description for Google service
      table: {
        headers: ['Feature', 'Code Snippet'],
        rows: [
          // [
          //   <a
          //     key="https://developers.google.com/identity/sign-in/web/deprecation-and-sunset"
          //     href="https://developers.google.com/identity/sign-in/web/deprecation-and-sunset"
          //     target="_blank"
          //     rel="noopener noreferrer"
          //     className="text-blue-500 dark:text-blue-200 underline"
          //   >
          //     gapi.auth2
          //   </a>,
          //   'w.onbeforeunload=function(){"undefined"!=typeof gapi&&void 0!==gapi.auth2',
          // ],
          // ['.getAuthInstance(', '.getAuthInstance('],
        ],
      },
    },
    {
      count: 0,
      isAffected: true,
      title: 'Avoid use of unsupported Google Identity Services features.',
      superTitle: 'Google Identity Services Detected',
      superTitleDescription: 'unsupported GIS features found',
      description:
        'Due to Privacy Sandbox enforcements some features are backward incompatible or deprecated.This report performs a page scan for script src elements and affected JavaScript objects and methods. Review the features in the following table and migrate if necessary.',
      table: {
        headers: ['Feature', 'Code Snippet'],
        rows: [
          // [
          //   `<a
          //       key="https://developers.google.com/identity/sign-in/web/deprecation-and-sunset"
          //       href="https://developers.google.com/identity/sign-in/web/deprecation-and-sunset"
          //       target="_blank"
          //       rel="noopener noreferrer"
          //       className="text-blue-500 dark:text-blue-200 underline"
          //     >
          //       gapi.auth2
          //     </a>`,
          //   'w.onbeforeunload=function(){"undefined"!=typeof gapi&&void 0!==gapi.auth2',
          // ],
          // ['.getAuthInstance(', '.getAuthInstance('],
        ],
      },
    },
  ],
};

export const generateGsiReportingData = (
  gsi1reportData: DetectedSignature[],
  gsi2reportData: DetectedSignature[]
) => {
  const cloneReportItemData: DeprecatedSignatureDetectedReportItem = {
    ...mockGSIReportItemData,
  };

  cloneReportItemData.accordion[0].count = gsi2reportData.length || 0;
  cloneReportItemData.accordion[0].table.rows = gsi2reportData.map(
    (item: {
      feature: { text: string; url: string };
      subItems: { items: { snippet: string }[] };
    }) => [item.feature, item.subItems.items]
  );

  cloneReportItemData.accordion[1].count = gsi1reportData.length || 0;
  cloneReportItemData.accordion[1].table.rows = gsi1reportData.map(
    (item: {
      feature: { text: string; url: string };
      subItems: { items: { snippet: string }[] };
    }) => [item.feature, item.subItems.items]
  );

  const cloneMockCirclePieChartData = { ...mockCirclePieChartData };
  cloneMockCirclePieChartData.centerCount =
    cloneReportItemData.accordion.reduce(
      (accumulator, currentValue) => accumulator + currentValue.count,
      0
    );

  cloneMockCirclePieChartData.data[0].count =
    cloneReportItemData.accordion[0].count;

  cloneMockCirclePieChartData.data[1].count =
    cloneReportItemData.accordion[1].count;

  if (
    cloneMockCirclePieChartData.data[0].count +
      cloneMockCirclePieChartData.data[1].count ===
    0
  ) {
    cloneMockCirclePieChartData.title =
      'No deprecated or unsupported GSI features found';
  }

  return {
    cloneReportItemData,
    cloneMockCirclePieChartData,
  };
};

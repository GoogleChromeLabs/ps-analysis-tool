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
 * External dependencies.
 */
import React from 'react';
import { addUTMParams } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import type { PSInfo as PSInfoType } from './fetchPSInfo';
import RenderLink from './renderLink';

/**
 * @type {Array} LABELS - Array of objects containing the label and link label for each dropdown item.
 * @property {string} label - The label for the dropdown item.
 * @property {string} linkLabel - The label for the link.
 */
const LABELS = [
  {
    label: 'proposal',
    linkLabel: 'proposalNote',
    useI18n: true,
  },
  {
    label: 'Public Explainer',
    linkLabel: 'Implementation explainer',
    useI18n: false,
  },
  {
    label: 'publicDiscussion',
    linkLabel: 'publicDiscussionNote',
    useI18n: true,
  },
  {
    label: 'videoOverview',
    linkLabel: 'videoOverviewNote',
    useI18n: true,
  },
  {
    label: 'devDocumentation',
    linkLabel: 'devDocumentationNote',
    useI18n: true,
  },
];

interface LearnMoreDropdownProps {
  PSInfo: PSInfoType;
  hasSeparator?: boolean;
}

const LearnMoreDropdown = ({
  PSInfo: {
    proposal,
    publicExplainer,
    publicDiscussion,
    videoOverview,
    devDocumentation,
  },
}: LearnMoreDropdownProps) => {
  return (
    <>
      <div className="flow-root border-t border-gray-200 dark:border-gray-500">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-500"
        >
          {[
            proposal,
            publicExplainer,
            publicDiscussion,
            videoOverview,
            devDocumentation,
          ].map((value, index) => {
            if (!value) {
              return null;
            }

            const label = LABELS[index].useI18n
              ? I18n.getMessage(LABELS[index].label)
              : LABELS[index].label;

            const linkLabel = LABELS[index].useI18n
              ? I18n.getMessage(LABELS[index].linkLabel)
              : LABELS[index].linkLabel;

            return (
              <RenderLink
                key={index}
                link={
                  value?.startsWith('https://developers.google.com') ||
                  value?.startsWith('https://www.youtube.com') ||
                  value?.startsWith('https://youtu.be/')
                    ? addUTMParams(value)
                    : value
                }
                label={label}
                linkLabel={linkLabel}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default LearnMoreDropdown;

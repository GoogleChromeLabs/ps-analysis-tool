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
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import RightArrow from '../../../../../icons/right-arrow.svg';
import type { PSInfo as PSInfoType } from '../../../../utils/fetchPSInfo';
import RenderLink from './renderLink';

interface LearnMoreDropdownProps {
  PSInfo: PSInfoType;
}

const LearnMoreDropdown = ({ PSInfo }: LearnMoreDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="flow-root border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {PSInfo.proposal && (
              <RenderLink
                label="Proposal"
                link={PSInfo.proposal}
                linkLabel="Public explanation for the proposed solution (Chrome)"
              />
            )}
            {PSInfo.publicDiscussion && (
              <RenderLink
                label="Public Discussion"
                link={PSInfo.publicDiscussion}
                linkLabel="Public questions and feedback about the proposal"
              />
            )}
            {PSInfo.videoOverview && (
              <RenderLink
                label="Video Overview"
                link={PSInfo.videoOverview}
                linkLabel="Short summary video"
              />
            )}
            {PSInfo.devDocumentation && (
              <RenderLink
                label="Dev Documentation"
                link={PSInfo.devDocumentation}
                linkLabel="Developer documentation"
              />
            )}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-start pt-4 border-t border-gray-200">
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            'Close'
          ) : (
            <>
              Learn more{' '}
              <span className="w-4 h-4 ml-2">
                <RightArrow />
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
};

export default LearnMoreDropdown;

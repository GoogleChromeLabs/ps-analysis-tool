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
import PSInfo from './PSInfo.json';
import type { PSInfoKeyType } from './types';
import RightArrow from '../../../../../icons/right-arrow.svg';

interface LearnMoreDropdownProps {
  infoKey: PSInfoKeyType;
}

const LearnMoreDropdown = ({ infoKey }: LearnMoreDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="flow-root border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {PSInfo[infoKey].proposal && (
              <li className="py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate capitalize">
                      Proposal
                    </p>
                    <a
                      href={PSInfo[infoKey].proposal}
                      className="text-xs text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Public explanation for the proposed solution (Chrome)
                    </a>
                  </div>
                </div>
              </li>
            )}
            {PSInfo[infoKey].publicDiscussion && (
              <li className="py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate capitalize">
                      Public Discussion
                    </p>
                    <a
                      href={PSInfo[infoKey].publicDiscussion}
                      className="text-xs text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Public questions and feedback about the proposal
                    </a>
                  </div>
                </div>
              </li>
            )}
            {PSInfo[infoKey].videoOverview && (
              <li className="py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate capitalize">
                      Video Overview
                    </p>
                    <a
                      href={PSInfo[infoKey].videoOverview as string}
                      className="text-xs text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Short summary video
                    </a>
                  </div>
                </div>
              </li>
            )}
            {PSInfo[infoKey].devDocumentation && (
              <li className="py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate capitalize">
                      Dev Documentation
                    </p>
                    <a
                      href={PSInfo[infoKey].devDocumentation}
                      className="text-xs text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Developer documentation
                    </a>
                  </div>
                </div>
              </li>
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

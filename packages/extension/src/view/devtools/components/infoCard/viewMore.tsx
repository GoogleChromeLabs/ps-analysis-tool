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

/**
 * Internal dependencies.
 */
import apis from './PSInfo.json';

interface IViewMore {
  api: 'private-state-token';
  open: boolean;
  onClose: () => void;
}

const ViewMore = ({ api, open, onClose }: IViewMore) => {
  return open ? (
    <>
      <div className="flow-root border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {Object.entries(apis[api]).map(([key, value], idx) => {
            if (idx === 0 || idx === 1) {
              return null;
            }
            return (
              <li key={idx} className="py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate capitalize">
                      {key}
                    </p>
                    <a
                      href={value}
                      className="text-xs text-blue-600 hover:text-blue-700"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {value}
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center justify-start pt-4 border-t border-gray-200">
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 float-right"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </>
  ) : (
    <></>
  );
};

export default ViewMore;

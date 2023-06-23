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
import React, { useCallback } from 'react';

/**
 * Internal dependencies.
 */
import apis from './PSInfo.json';

interface IInfoCardModal {
  api: 'private-state-token';
  open: boolean;
  onClose: () => void;
}

const InfoCardModal = ({ api, open, onClose }: IInfoCardModal) => {
  const openLink = useCallback((url: string) => {
    chrome.tabs.create({ url: url, active: true });
  }, []);

  return open ? (
    <>
      <div className="fixed left-0 top-0 right-0 z-50 w-full p-4 overflow-auto h-full max-h-full">
        <div className="min-w-min relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-500">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {apis[api].name} API
            </h3>
            <button
              type="button"
              className="text-gray-300 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-500 dark:hover:text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <div className="p-6">
            <table className="table-auto dark:text-white">
              <tbody>
                <tr className="md:text-lg text-sm dark:bg-gray-700 dark:hover:bg-gray-500 border-b">
                  <td className="border px-4 py-2 font-semibold">
                    {apis[api].name}
                  </td>
                  <td className="border px-4 py-2 dark:text-gray-300">
                    {apis[api].description}
                  </td>
                </tr>
                <tr className="dark:bg-gray-600 dark:hover:bg-gray-500 border-b">
                  <td className="border px-4 py-2 font-medium">Proposal</td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-left text-blue-300 hover:text-blue-400"
                      onClick={openLink.bind(null, apis[api].proposal)}
                    >
                      {apis[api].proposal}
                    </button>
                  </td>
                </tr>
                <tr className="dark:bg-gray-700 dark:hover:bg-gray-500 border-b">
                  <td className="border px-4 py-2 font-medium">
                    Public Discussion
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-left text-blue-300 hover:text-blue-400"
                      onClick={openLink.bind(null, apis[api].publicDiscussion)}
                    >
                      {apis[api].publicDiscussion}
                    </button>
                  </td>
                </tr>
                <tr className="dark:bg-gray-600 dark:hover:bg-gray-500 border-b">
                  <td className="border px-4 py-2 font-medium">
                    Video Overview
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-left text-blue-300 hover:text-blue-400"
                      onClick={openLink.bind(null, apis[api].videoOverview)}
                    >
                      {apis[api].videoOverview}
                    </button>
                  </td>
                </tr>
                <tr className="dark:bg-gray-700 dark:hover:bg-gray-500 border-b">
                  <td className="border px-4 py-2 font-medium">
                    Dev Documentation
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-left text-blue-300 hover:text-blue-400"
                      onClick={openLink.bind(null, apis[api].devDocumentation)}
                    >
                      {apis[api].devDocumentation}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full h-full max-h-full absolute bg-white opacity-90 z-20 top-0 left-0" />
    </>
  ) : (
    <></>
  );
};

export default InfoCardModal;

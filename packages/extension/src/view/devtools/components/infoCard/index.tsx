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
import apis from './PSInfo.json';
import ViewMore from './viewMore';
import type { PSAPIKeyType } from './types';

interface IInfoCardProps {
  api: PSAPIKeyType;
}

const InfoCard = ({ api }: IInfoCardProps) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-2 p-3">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {apis[api].name} API
        </h5>
        <p className="mb-3 text-gray-700">{apis[api].description}</p>
        {!openModal && (
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={setOpenModal.bind(null, !openModal)}
          >
            View more
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
        <ViewMore
          api={api}
          open={openModal}
          onClose={setOpenModal.bind(null, false)}
        />
      </div>
    </div>
  );
};

export default InfoCard;

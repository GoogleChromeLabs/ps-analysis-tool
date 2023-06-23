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
import InfoCardModal from './infoCardModal';

interface IInfoCardProps {
  api: 'private-state-token';
}

const InfoCard = ({ api }: IInfoCardProps) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="box-border cursor-pointer border border-transparent border-gray-500 rounded-full hover:opacity-80">
        <button
          className="w-full h-full px-5 py-3 flex flex-row justify-between items-center"
          onClick={setOpenModal.bind(null, true)}
        >
          <div className="flex flex-col items-start">
            <h3 className="font-bold text-xl text-sky-600">
              {apis[api].name} API
            </h3>
            <hr className="animate-bounce w-1/3 border border-solid border-sky-600" />
          </div>
          <p className="motion-safe:animate-pulse text-gray-500">Learn more</p>
        </button>
      </div>
      <InfoCardModal
        api={api}
        open={openModal}
        onClose={setOpenModal.bind(null, false)}
      />
    </div>
  );
};

export default InfoCard;

/*
 * Copyright 2024 Google LLC
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
import { PillToggle } from '@google-psat/design-system';
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import ReceivedBidsTable from './receivedBidsTable';
import NoBidsTable from './noBidsTable';

enum PillToggleOptions {
  ReceivedBids = 'Received Bids',
  NoBids = 'No Bids',
}

const Bids = () => {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.ReceivedBids
  );

  return (
    <>
      <PillToggle
        firstOption={PillToggleOptions.ReceivedBids}
        secondOption={PillToggleOptions.NoBids}
        pillToggle={pillToggle}
        setPillToggle={setPillToggle}
      />
      {pillToggle === PillToggleOptions.ReceivedBids ? (
        <ReceivedBidsTable
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
        />
      ) : (
        <NoBidsTable
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
        />
      )}
    </>
  );
};

export default Bids;

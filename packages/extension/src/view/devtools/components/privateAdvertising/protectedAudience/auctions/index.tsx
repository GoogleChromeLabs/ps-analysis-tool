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
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import Breakpoints from './breakpoints';
import AuctionTable from './auctionTable';
import BottomTray from './bottomTray';
import { Resizable } from 're-resizable';

const Auctions = () => {
  const [selectedJSON, setSelectedJSON] = useState(null);

  return (
    <div className="w-full h-full flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        enable={{
          bottom: true,
        }}
        minHeight="10%"
        maxHeight="90%"
      >
        <Breakpoints />
        {['Dummy'].map((auction) => (
          <AuctionTable key={auction} setSelectedJSON={setSelectedJSON} />
        ))}
      </Resizable>
      <BottomTray selectedJSON={selectedJSON} />
    </div>
  );
};

export default Auctions;

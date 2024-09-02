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
import { I18n } from '@google-psat/i18n';
import { Resizable } from 're-resizable';
import { prettyPrintJson } from 'pretty-print-json';
import type { NoBidsType, singleAuctionEvent } from '@google-psat/common';

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
  const [selectedRow, setSelectedRow] = useState<
    singleAuctionEvent | NoBidsType[keyof NoBidsType] | null
  >(null);
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.ReceivedBids
  );

  return (
    <div className="flex flex-col pt-4 h-full w-full">
      <div className="px-4 pb-4">
        <PillToggle
          firstOption={PillToggleOptions.ReceivedBids}
          secondOption={PillToggleOptions.NoBids}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {pillToggle === PillToggleOptions.ReceivedBids ? (
          <div className="w-full h-full border-t border-american-silver dark:border-quartz overflow-auto">
            <ReceivedBidsTable
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
            />
          </div>
        ) : (
          <div className="w-[42rem] h-full border-r border-t border-american-silver dark:border-quartz">
            <NoBidsTable
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
            />
          </div>
        )}
      </div>
      <Resizable
        defaultSize={{
          width: '100%',
          height: '20%',
        }}
        minHeight="10%"
        maxHeight="90%"
        enable={{
          top: true,
        }}
      >
        <div className="text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
          {selectedRow ? (
            <div className="text-xs py-1 px-1.5">
              <pre>
                <div
                  dangerouslySetInnerHTML={{
                    __html: prettyPrintJson.toHtml(selectedRow),
                  }}
                />
              </pre>
            </div>
          ) : (
            <div className="h-full p-8 flex items-center">
              <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
                {I18n.getMessage('selectRowToPreview')}
              </p>
            </div>
          )}
        </div>
      </Resizable>
    </div>
  );
};

export default Bids;

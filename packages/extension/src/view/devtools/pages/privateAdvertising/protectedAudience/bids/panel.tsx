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
import React, { useMemo, useState } from 'react';
import {
  JsonView,
  PillToggle,
  Timeline,
  useTabs,
  Slider,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { Resizable } from 're-resizable';
import type {
  NoBidsType,
  ReceivedBids,
  PrebidEvents,
} from '@google-psat/common';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import ReceivedBidsTable from './receivedBidsTable';
import NoBidsTable from './noBidsTable';
import { useProtectedAudience } from '../../../../stateProviders';
import Placeholder from './placeholder';

enum PillToggleOptions {
  ReceivedBids = 'Received Bids',
  NoBids = 'No Bids',
  TimelineName = 'Timeline',
}

interface PanelProps {
  storage?: string[];
  setStorage?: (data: string, index: number) => void;
  timelines: PrebidEvents['auctionEvents'];
  eeAnimatedTab?: boolean;
}

const Panel = ({
  storage,
  setStorage,
  timelines,
  eeAnimatedTab = false,
}: PanelProps) => {
  const { receivedBids, noBids } = useProtectedAudience(({ state }) => ({
    receivedBids: state.receivedBids,
    noBids: state.noBids,
  }));
  const { setPAActiveTab } = useTabs(({ actions }) => ({
    setPAActiveTab: actions.setActiveTab,
  }));
  const [selectedRow, setSelectedRow] = useState<
    ReceivedBids | NoBidsType[keyof NoBidsType] | null
  >(null);
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.ReceivedBids
  );
  const [zoomLevel, setZoomLevel] = useState<number>(2);

  const showBottomTray = useMemo(() => {
    if (pillToggle === PillToggleOptions.ReceivedBids) {
      return receivedBids.length > 0;
    } else if (pillToggle === PillToggleOptions.NoBids) {
      return Object.keys(noBids).length > 0;
    } else if (pillToggle === PillToggleOptions.TimelineName) {
      return Object.keys(timelines).length > 0;
    }

    return false;
  }, [noBids, pillToggle, receivedBids.length, timelines]);

  let activePage = null;

  if (pillToggle === PillToggleOptions.ReceivedBids) {
    activePage = (
      <div className="w-full h-full border-american-silver dark:border-quartz overflow-auto">
        <ReceivedBidsTable
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
          receivedBids={receivedBids}
          storage={storage}
          setStorage={setStorage}
          showEvaluationPlaceholder={!eeAnimatedTab}
        />
      </div>
    );
  } else if (pillToggle === PillToggleOptions.NoBids) {
    activePage = (
      <div
        className={classNames(
          'h-full border-r border-american-silver dark:border-quartz',
          Object.keys(noBids).length > 0 ? 'w-[42rem]' : 'w-full'
        )}
      >
        <NoBidsTable
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
          noBids={noBids}
          showEvaluationPlaceholder={!eeAnimatedTab}
        />
      </div>
    );
  } else if (pillToggle === PillToggleOptions.TimelineName) {
    activePage = (
      <div className="w-full h-full px-5">
        {timelines && Object.entries(timelines).length > 0 ? (
          Object.entries(timelines).map(([auctionId, auction]) => (
            <div key={auctionId} className="my-4">
              <Timeline
                {...auction}
                zoomLevel={zoomLevel}
                setSelectedRow={setSelectedRow}
                navigateToAuction={() => setPAActiveTab(5)}
              />
            </div>
          ))
        ) : (
          <Placeholder showEvaluationPlaceholder={true} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="absolute top-[12px] left-[250px]">
        <PillToggle
          options={[
            PillToggleOptions.ReceivedBids,
            PillToggleOptions.NoBids,
            PillToggleOptions.TimelineName,
          ]}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={eeAnimatedTab}
        />
      </div>
      {pillToggle === PillToggleOptions.TimelineName &&
        Object.entries(timelines).length > 0 && (
          <div className="absolute top-[18px] right-[20px]">
            <Slider
              sliderStep={zoomLevel}
              setSliderStep={(step) => {
                setZoomLevel(step);
              }}
              label="Zoom"
              min={1}
              max={4}
              step={1}
            />
          </div>
        )}
      <div className="flex-1 overflow-auto text-outer-space-crayola">
        {activePage}
      </div>
      {showBottomTray && (
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
          <div className="text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
            {selectedRow ? (
              <div className="text-xs py-1 px-1.5">
                <JsonView src={selectedRow} />
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
      )}
    </div>
  );
};

export default Panel;

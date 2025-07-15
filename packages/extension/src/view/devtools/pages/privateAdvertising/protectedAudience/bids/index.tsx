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
import React, { useEffect, useMemo, useState } from 'react';
import {
  DoubleArrow,
  PillToggle,
  Slider,
  useTabs,
} from '@google-psat/design-system';
import { prepareTimelineData, type NoBidsType } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { usePrebid, useProtectedAudience } from '../../../../stateProviders';
import Panel from './panel';
import { BidsPillOptions, PanelOptions } from './enums';

const Bids = () => {
  const { paapi } = useProtectedAudience(({ state }) => ({
    paapi: {
      receivedBids: state.receivedBids,
      noBids: state.noBids,
      auctionEvents: state.auctionEvents,
    },
  }));

  const { prebidNoBids, prebidReceivedBids, prebidAuctionEvents } = usePrebid(
    ({ state }) => ({
      prebidNoBids: state.prebidData?.noBids,
      prebidReceivedBids: state.prebidData?.receivedBids,
      prebidAuctionEvents: state.prebidData?.auctionEvents,
    })
  );

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const [panelPillToggle, setPanelPillToggle] = useState<string | null>(
    prebidReceivedBids?.length ||
      Object.keys(prebidNoBids || {}).length ||
      (Number(paapi.receivedBids?.length || 0) === 0 &&
        Object.keys(paapi.noBids || {}).length === 0)
      ? PanelOptions.Prebid
      : PanelOptions.PAAPI
  );
  const [highlightOption, setHighlightOption] = useState<string>('');

  useEffect(() => {
    if (paapi?.receivedBids?.length || paapi?.noBids?.length) {
      setHighlightOption(PanelOptions.PAAPI);
    }
  }, [paapi]);

  const [bidsPillToggle, setBidsPillToggle] = useState<string | null>(
    BidsPillOptions.ReceivedBids
  );

  const processedPrebidNoBids = useMemo(() => {
    if (!prebidNoBids) {
      return {};
    }

    return Object.entries(prebidNoBids).reduce((acc, [key, value]) => {
      const bids = value?.bidder.map((bid) => ({
        ownerOrigin: bid,
        name: bid,
        ...value,
      }));

      acc[key] = bids;

      return acc;
    }, {} as Record<string, NoBidsType[keyof NoBidsType][]>);
  }, [prebidNoBids]);

  const noBids = useMemo(() => {
    if (panelPillToggle === PanelOptions.Prebid) {
      return Object.values(processedPrebidNoBids).flat() || [];
    }

    return Object.values(paapi?.noBids) || [];
  }, [paapi?.noBids, panelPillToggle, processedPrebidNoBids]);

  const receivedBids = useMemo(() => {
    if (panelPillToggle === PanelOptions.Prebid) {
      return prebidReceivedBids || [];
    }

    return paapi?.receivedBids || [];
  }, [paapi?.receivedBids, panelPillToggle, prebidReceivedBids]);

  const timelines = useMemo(() => {
    if (panelPillToggle === PanelOptions.Prebid) {
      if (!prebidAuctionEvents) {
        return [];
      }

      return prepareTimelineData(prebidAuctionEvents, true);
    }

    if (!paapi?.auctionEvents) {
      return [];
    }

    return prepareTimelineData(paapi.auctionEvents, false);
  }, [paapi.auctionEvents, panelPillToggle, prebidAuctionEvents]);

  const [zoomLevel, setZoomLevel] = useState(1.5);

  return (
    <div className="flex flex-col pt-4 h-full w-full">
      <div className="flex justify-between items-center">
        <div className="px-4 pb-4 flex gap-4 items-center">
          <PillToggle
            options={[PanelOptions.Prebid, PanelOptions.PAAPI]}
            pillToggle={panelPillToggle}
            setPillToggle={setPanelPillToggle}
            eeAnimatedTab={false}
            highlightOption={highlightOption}
            setHighlightOption={setHighlightOption}
            persistenceKey="bidsPanelPillToggle"
          />
          <DoubleArrow
            width="30px"
            height="30px"
            className="fill-charcoal-gray"
          />
          <PillToggle
            options={[
              BidsPillOptions.ReceivedBids,
              BidsPillOptions.NoBids,
              BidsPillOptions.Timeline,
            ]}
            pillToggle={bidsPillToggle}
            setPillToggle={setBidsPillToggle}
            eeAnimatedTab={false}
            persistenceKey="bidsPillToggle"
          />
        </div>
        {bidsPillToggle === BidsPillOptions.Timeline &&
          Object.entries(timelines).length > 0 && (
            <div className="px-4">
              <Slider
                sliderStep={zoomLevel}
                setSliderStep={(step: number) => {
                  setZoomLevel(step);
                }}
                label="Zoom"
                min={0.5}
                max={2.5}
                step={0.5}
              />
            </div>
          )}
      </div>
      {!panelPillToggle || !bidsPillToggle ? null : (
        <Panel
          receivedBids={receivedBids}
          noBids={noBids}
          storage={storage}
          setStorage={setStorage}
          bidsPillToggle={bidsPillToggle}
          panelPillToggle={panelPillToggle}
          timelines={timelines}
          zoomLevel={zoomLevel}
        />
      )}
    </div>
  );
};

export default Bids;

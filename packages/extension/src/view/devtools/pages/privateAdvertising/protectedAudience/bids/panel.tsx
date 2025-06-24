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
import {
  JsonView,
  Timeline,
  useTabs,
  ResizableTray,
  type TimelineProps,
  useSidebar,
  SIDEBAR_ITEMS_KEYS,
} from '@google-psat/design-system';
import React, { useCallback, useMemo, useState } from 'react';
import { I18n } from '@google-psat/i18n';
import type {
  NoBidsType,
  PrebidEvents,
  ReceivedBids,
} from '@google-psat/common';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import ReceivedBidsTable from './receivedBidsTable';
import NoBidsTable from './noBidsTable';
import Placeholder from './placeholder';
import { BidsPillOptions } from './enums';
import { useSettings } from '../../../../stateProviders';

interface PanelProps {
  receivedBids: ReceivedBids[];
  noBids: NoBidsType[keyof NoBidsType][];
  storage?: string[];
  setStorage?: (data: string, index: number) => void;
  eeAnimatedTab?: boolean;
  bidsPillToggle: string;
  panelPillToggle: string;
  timelines: PrebidEvents['auctionEvents'];
  zoomLevel?: number;
}

const Panel = ({
  receivedBids,
  noBids,
  storage,
  setStorage,
  eeAnimatedTab = false,
  bidsPillToggle,
  panelPillToggle,
  timelines,
  zoomLevel = 2,
}: PanelProps) => {
  const [selectedRow, setSelectedRow] = useState<
    ReceivedBids | NoBidsType[keyof NoBidsType] | null
  >(null);

  const showBottomTray = useMemo(() => {
    if (bidsPillToggle === BidsPillOptions.ReceivedBids) {
      return receivedBids.length > 0;
    }

    if (bidsPillToggle === BidsPillOptions.NoBids) {
      return Object.keys(noBids || {}).length > 0;
    }

    return Object.entries(timelines || {}).length > 0;
  }, [bidsPillToggle, timelines, receivedBids.length, noBids]);

  const { setPAActiveTab, setPAStorage } = useTabs(({ actions }) => ({
    setPAActiveTab: actions.setActiveTab,
    setPAStorage: actions.setStorage,
  }));

  const navigateToAuction = useCallback(
    (data: string) => {
      setPAStorage(data, 5);
      setPAActiveTab(5);
    },
    [setPAActiveTab, setPAStorage]
  );

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const cdpNavigation = useCallback(() => {
    document.getElementById('cookies-landing-scroll-container')?.scrollTo(0, 0);
    updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
  }, [updateSelectedItemKey]);

  return (
    <>
      {!isUsingCDP && panelPillToggle === 'PAAPI' ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm text-raisin-black dark:text-bright-gray">
            To view ad units, enable PSAT to use CDP via the{' '}
            <button
              className="text-bright-navy-blue dark:text-jordy-blue"
              onClick={cdpNavigation}
            >
              Settings Page
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto text-outer-space-crayola">
          {bidsPillToggle === BidsPillOptions.ReceivedBids && (
            <div className="w-full h-full border-t border-american-silver dark:border-quartz overflow-auto">
              <ReceivedBidsTable
                setSelectedRow={setSelectedRow}
                selectedRow={selectedRow}
                receivedBids={receivedBids}
                storage={storage}
                setStorage={setStorage}
                showEvaluationPlaceholder={!eeAnimatedTab}
              />
            </div>
          )}

          {bidsPillToggle === BidsPillOptions.NoBids && (
            <div
              className={classNames(
                'h-full border-r border-t border-american-silver dark:border-quartz',
                Object.keys(noBids).length > 0 ? 'w-fit' : 'w-full'
              )}
            >
              <NoBidsTable
                setSelectedRow={setSelectedRow}
                selectedRow={selectedRow}
                noBids={noBids}
                showEvaluationPlaceholder={!eeAnimatedTab}
              />
            </div>
          )}

          {bidsPillToggle === BidsPillOptions.Timeline && (
            <div className="w-full h-full px-4 border-t border-american-silver dark:border-quartz">
              {timelines && Object.entries(timelines).length > 0 ? (
                Object.entries(timelines).map(([auctionId, auction]) => (
                  <div key={auctionId} className="my-4">
                    <Timeline
                      {...(auction as unknown as TimelineProps)}
                      zoomLevel={zoomLevel}
                      setSelectedRow={setSelectedRow}
                      navigateToAuction={navigateToAuction}
                    />
                  </div>
                ))
              ) : (
                <Placeholder showEvaluationPlaceholder={true} />
              )}
            </div>
          )}
        </div>
      )}
      {showBottomTray && (
        <ResizableTray
          defaultSize={{
            width: '100%',
            height: '20%',
          }}
          minHeight="10%"
          maxHeight="90%"
          enable={{
            top: true,
          }}
          trayId="bids-panel-bottom-tray"
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
        </ResizableTray>
      )}
    </>
  );
};

export default Panel;

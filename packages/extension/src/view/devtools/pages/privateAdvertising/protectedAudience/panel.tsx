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
 * External dependencies
 */
import { Tabs, useTabs } from '@google-psat/design-system';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies
 */
import { useProtectedAudience } from '../../../stateProviders';

const Panel = () => {
  const { panel, highlightTab } = useTabs(({ state, actions }) => ({
    panel: state.panel,
    highlightTab: actions.highlightTab,
  }));

  const ActiveTabContent = panel.Element;
  const { className, props } = panel;

  const {
    interestGroupDetails,
    adsAndBidders,
    receivedBids,
    noBids,
    auctionEvents,
  } = useProtectedAudience(({ state }) => ({
    interestGroupDetails: state.interestGroupDetails,
    adsAndBidders: state.adsAndBidders,
    receivedBids: state.receivedBids,
    noBids: state.noBids,
    auctionEvents: state.auctionEvents ?? {},
  }));

  const data = useRef<{
    interestGroupDetails?: typeof interestGroupDetails;
    adsAndBidders?: typeof adsAndBidders;
    receivedBids?: typeof receivedBids;
    noBids?: typeof noBids;
    auctionEvents?: typeof auctionEvents;
  } | null>(null);

  useEffect(() => {
    let store = data.current;

    const filteredIGRefData = data.current?.interestGroupDetails?.filter(
      (event) => event.type === 'leave' || event.type === 'join'
    );
    const filteredIGData = interestGroupDetails.filter(
      (event) => event.type === 'leave' || event.type === 'join'
    );

    if (filteredIGData.length !== filteredIGRefData?.length) {
      if (filteredIGData.length > 0) {
        highlightTab(2);
      } else {
        highlightTab(2, false);
      }

      store = {
        ...store,
        interestGroupDetails: filteredIGData,
      };
    }

    if (!isEqual(data.current?.adsAndBidders, adsAndBidders)) {
      if (Object.keys(adsAndBidders).length > 0) {
        highlightTab(3);
      } else {
        highlightTab(3, false);
      }

      store = {
        ...store,
        adsAndBidders,
      };
    }

    if (!isEqual(data.current?.receivedBids, receivedBids)) {
      if (receivedBids.length > 0) {
        highlightTab(3);
        highlightTab(5);
      } else {
        highlightTab(3, false);
        highlightTab(5, false);
      }

      store = {
        ...store,
        receivedBids,
      };
    }

    if (!isEqual(data.current?.noBids, noBids)) {
      if (Object.keys(noBids).length > 0) {
        highlightTab(3);
        highlightTab(5);
      } else {
        highlightTab(3, false);
        highlightTab(5, false);
      }

      store = {
        ...store,
        noBids,
      };
    }

    if (
      !isEqual(data.current?.auctionEvents, auctionEvents) &&
      !isEqual(data.current?.adsAndBidders, adsAndBidders)
    ) {
      if (
        Object.keys(auctionEvents).length > 0 &&
        Object.keys(adsAndBidders).length > 0
      ) {
        highlightTab(4);
      } else {
        highlightTab(4, false);
      }

      store = {
        ...store,
        auctionEvents,
      };
    }

    data.current = store;
  }, [
    adsAndBidders,
    auctionEvents,
    highlightTab,
    interestGroupDetails,
    noBids,
    receivedBids,
  ]);

  return (
    <div
      data-testid="protected-audience-content"
      className="h-screen w-full flex flex-col overflow-hidden"
    >
      <Tabs />
      <div
        className={classNames('overflow-auto', className)}
        style={{
          minHeight: 'calc(100% - 93px)',
        }}
      >
        {ActiveTabContent && <ActiveTabContent {...props} />}
      </div>
    </div>
  );
};

export default Panel;

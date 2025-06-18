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
import { LandingPage, useTabs } from '@google-psat/design-system';
import React, { useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies
 */
import { usePrebid, useProtectedAudience } from '../../../stateProviders';

const Panel = () => {
  const { panel, highlightTab } = useTabs(({ state, actions }) => ({
    panel: state.panel,
    highlightTab: actions.highlightTab,
  }));

  const ActiveTabContent = panel.Element;
  const { props, className, containerClassName } = panel;

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

  const {
    prebidAdunits,
    prebidAuctionEvents,
    prebidReceivedBids,
    prebidNoBids,
  } = usePrebid(({ state }) => ({
    prebidAdunits: state.prebidData?.adUnits,
    prebidAuctionEvents: state.prebidData?.auctionEvents,
    prebidReceivedBids: state.prebidData?.receivedBids,
    prebidNoBids: state.prebidData?.noBids,
  }));

  const data = useRef<{
    interestGroupDetails?: typeof interestGroupDetails;
    adsAndBidders?: typeof adsAndBidders;
    receivedBids?: typeof receivedBids;
    noBids?: typeof noBids;
    auctionEvents?: typeof auctionEvents;
    prebidAdunits?: typeof prebidAdunits;
    prebidAuctionEvents?: typeof prebidAuctionEvents;
    prebidReceivedBids?: typeof prebidReceivedBids;
    prebidNoBids?: typeof prebidNoBids;
  } | null>(null);

  // eslint-disable-next-line complexity
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
        highlightTab(3);
      }

      store = {
        ...store,
        interestGroupDetails: filteredIGData,
      };
    }

    if (!isEqual(data.current?.adsAndBidders, adsAndBidders)) {
      if (Object.keys(adsAndBidders).length > 0) {
        highlightTab(4);
      }

      store = {
        ...store,
        adsAndBidders,
      };
    }

    if (!isEqual(data.current?.receivedBids, receivedBids)) {
      if (receivedBids.length > 0) {
        highlightTab(4);
        highlightTab(6);
      }

      store = {
        ...store,
        receivedBids,
      };
    }

    if (!isEqual(data.current?.noBids, noBids)) {
      if (Object.keys(noBids).length > 0) {
        highlightTab(4);
        highlightTab(6);
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
        highlightTab(5);
      }

      store = {
        ...store,
        auctionEvents,
      };
    }

    if (!isEqual(data.current?.prebidAdunits, prebidAdunits)) {
      if (Object.keys(prebidAdunits || {}).length > 0) {
        highlightTab(4);
      }

      store = {
        ...store,
        prebidAdunits,
      };
    }

    if (!isEqual(data.current?.prebidAuctionEvents, prebidAuctionEvents)) {
      if (Object.keys(prebidAuctionEvents || {}).length > 0) {
        highlightTab(5);
      }

      store = {
        ...store,
        auctionEvents,
      };
    }

    if (!isEqual(data.current?.prebidReceivedBids, prebidReceivedBids)) {
      if (prebidReceivedBids?.length) {
        highlightTab(6);
      }

      store = {
        ...store,
        prebidReceivedBids,
      };
    }

    if (!isEqual(data.current?.prebidNoBids, prebidNoBids)) {
      if (Object.keys(prebidNoBids || {}).length > 0) {
        highlightTab(6);
      }

      store = {
        ...store,
        prebidNoBids,
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
    prebidAdunits,
    prebidAuctionEvents,
    prebidReceivedBids,
    prebidNoBids,
  ]);

  useEffect(() => {
    const listener = ({
      frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        (frameType !== 'outermost_frame' && frameId !== 0) ||
        tabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }

      highlightTab(4, false);
      highlightTab(5, false);
      highlightTab(6, false);
    };

    chrome.webNavigation.onCommitted.addListener(listener);

    return () => {
      chrome.webNavigation.onCommitted.removeListener(listener);
    };
  }, [highlightTab]);

  return (
    <LandingPage
      title="Protected Audience"
      contentPanel={
        ActiveTabContent && (
          <div className={className}>
            <ActiveTabContent {...props} />
          </div>
        )
      }
      extraClasses={containerClassName}
      {...props}
    />
  );
};

export default Panel;

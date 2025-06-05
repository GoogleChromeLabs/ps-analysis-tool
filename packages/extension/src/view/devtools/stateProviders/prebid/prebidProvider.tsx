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
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import Context, { type PrebidContextType } from './context';
import type { PrebidEvents } from '../../../../store';

const Provider = ({ children }: PropsWithChildren) => {
  const [prebidAuctionEvents, setPrebidAuctionEvents] = useState<
    PrebidContextType['state']['prebidAuctionEvents']
  >({});

  const [prebidExists, setPrebidExists] =
    useState<PrebidContextType['state']['prebidExists']>(null);

  const [config, setConfig] = useState<PrebidContextType['state']['config']>(
    {}
  );

  const [errorEvents, setErrorEvents] = useState<
    PrebidContextType['state']['errorEvents']
  >([]);

  const [prebidNoBids, setPrebidNoBids] = useState<
    PrebidContextType['state']['prebidNoBids']
  >({});

  const [prebidReceivedBids, setPrebidReceivedBids] = useState<
    PrebidContextType['state']['prebidReceivedBids']
  >([]);

  const [installedModules, setInstalledModules] = useState<
    PrebidContextType['state']['installedModules']
  >([]);

  const [pbjsNamespace, setPBJSNamespace] =
    useState<PrebidContextType['state']['pbjsNamespace']>('');

  const [prebidAdUnits, setPrebidAdUnits] = useState<
    PrebidContextType['state']['prebidAdUnits']
  >({});

  const [versionInfo, setPrebidVersionInfo] =
    useState<PrebidContextType['state']['versionInfo']>('');

  const messagePassingListener = useCallback(
    (message: {
      type: string;
      payload: {
        tabId: number;
        prebidEvents: PrebidEvents;
      };
    }) => {
      if (!['PREBID_EVENTS'].includes(message.type)) {
        return;
      }

      if (!message.type) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const incomingMessageType = message.type;

      if (
        incomingMessageType === 'PREBID_EVENTS' &&
        typeof message.payload.prebidEvents !== 'undefined'
      ) {
        if (tabId.toString() === message.payload.tabId.toString()) {
          setPrebidExists(message.payload.prebidEvents.prebidExists);
          if (!message.payload.prebidEvents.prebidExists) {
            return;
          }
          setConfig((prev) => {
            return isEqual(message.payload.prebidEvents.config, prev)
              ? prev
              : message.payload.prebidEvents.config;
          });
          setErrorEvents(message.payload.prebidEvents.errorEvents);
          setInstalledModules(message.payload.prebidEvents.installedModules);
          setPBJSNamespace(message.payload.prebidEvents.pbjsNamespace);
          setPrebidAdUnits(message.payload.prebidEvents.adUnits);
          setPrebidAuctionEvents(message.payload.prebidEvents.auctionEvents);
          setPrebidNoBids(message.payload.prebidEvents.noBids);
          setPrebidReceivedBids(message.payload.prebidEvents.receivedBids);
          setPrebidVersionInfo(message.payload.prebidEvents.versionInfo);
        }
      }
    },
    []
  );

  const onCommittedNavigationListener = useCallback(
    ({
      frameId,
      frameType,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        frameType !== 'outermost_frame' ||
        frameId !== 0 ||
        tabId !== chrome.devtools.inspectedWindow.tabId
      ) {
        return;
      }

      setConfig({});
      setErrorEvents([]);
      setInstalledModules([]);
      setPBJSNamespace('');
      setPrebidAdUnits({});
      setPrebidAuctionEvents({});
      setPrebidExists(null);
      setPrebidNoBids({});
      setPrebidReceivedBids([]);
      setPrebidVersionInfo('');
    },
    []
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.webNavigation?.onCommitted?.addListener(
      onCommittedNavigationListener
    );

    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.webNavigation?.onCommitted?.removeListener(
        onCommittedNavigationListener
      );
    };
  }, [messagePassingListener, onCommittedNavigationListener]);

  const memoisedValue: PrebidContextType = useMemo(() => {
    return {
      state: {
        prebidAdUnits,
        prebidNoBids,
        versionInfo,
        installedModules,
        config,
        prebidReceivedBids,
        errorEvents,
        prebidAuctionEvents,
        pbjsNamespace,
        prebidExists,
      },
      actions: {},
    };
  }, [
    prebidAdUnits,
    prebidNoBids,
    versionInfo,
    installedModules,
    config,
    prebidReceivedBids,
    errorEvents,
    prebidAuctionEvents,
    pbjsNamespace,
    prebidExists,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;

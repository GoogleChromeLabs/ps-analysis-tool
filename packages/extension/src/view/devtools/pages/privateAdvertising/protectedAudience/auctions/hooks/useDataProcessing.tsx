/*
 * Copyright 2025 Google LLC
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
import { useCallback, useEffect, useMemo } from 'react';

/**
 * Internal dependencies.
 */
import { usePrebid, useProtectedAudience } from '../../../../../stateProviders';

const useDataProcessing = () => {
  const { paapi, isMultiSeller, setSortOrder } = useProtectedAudience(
    ({ state, actions }) => ({
      paapi: {
        auctionEvents: state.auctionEvents,
        adsAndBidders: state.adsAndBidders,
        isMultiSeller: state.isMultiSellerAuction,
        receivedBids: state.receivedBids,
        noBids: state.noBids,
      },
      isMultiSeller: state.isMultiSellerAuction,
      setSortOrder: actions.setSortOrder,
    })
  );

  const {
    prebidAdunits,
    prebidAuctionEvents,
    prebidNoBids,
    prebidReceivedBids,
  } = usePrebid(({ state }) => ({
    prebidAdunits: state.prebidData?.adUnits,
    prebidAuctionEvents: state.prebidData?.auctionEvents,
    prebidReceivedBids: state.prebidData?.receivedBids,
    prebidNoBids: state.prebidData?.noBids,
  }));

  const adUnits = useMemo(() => {
    if (Object.keys(prebidAdunits || {}).length > 0) {
      return Object.keys(prebidAdunits);
    }

    return Object.keys(paapi?.adsAndBidders || {});
  }, [paapi.adsAndBidders, prebidAdunits]);

  useEffect(() => {
    const _sortOrder: Record<string, 'asc' | 'desc'> = {};
    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAuctionEvents || {}).forEach((events) => {
        if (!events?.length || !events[0]?.adUnitCodes?.length) {
          return;
        }

        const _adUnits = events[0].adUnitCodes as string[];

        _adUnits.forEach((adUnit) => {
          _sortOrder[adUnit] = 'asc';
        });
      });
    }

    if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      const _adUnits = Object.keys(paapi.adsAndBidders || {});

      _adUnits.forEach((adUnit) => {
        _sortOrder[adUnit] = 'asc';
      });
    }
    setSortOrder(_sortOrder);
  }, [paapi.adsAndBidders, prebidAdunits, prebidAuctionEvents, setSortOrder]);

  const adUnitsTimestamp = useMemo(() => {
    const _adUnitsTimestamp: Record<string, string[]> = {};
    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAuctionEvents || {}).forEach((events) => {
        if (!events?.length || !events[0]?.adUnitCodes?.length) {
          return;
        }

        const _adUnits = events[0].adUnitCodes as string[];

        _adUnits.forEach((adUnit) => {
          _adUnitsTimestamp[adUnit] = [
            ...(_adUnitsTimestamp[adUnit] || []),
            new Date(events[0].timestamp).toISOString(),
          ];
        });
      });
    }

    if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      const _adUnits = Object.keys(paapi.adsAndBidders || {});

      _adUnits.forEach((adUnit) => {
        const events = paapi.auctionEvents?.[adUnit];

        if (Object.keys(events || {}).length > 0) {
          Object.keys(events || {}).forEach((time) => {
            _adUnitsTimestamp[adUnit] = [
              ...(_adUnitsTimestamp[adUnit] || []),
              time.split('||')[0],
            ];
          });
        }
      });
    }

    return _adUnitsTimestamp;
  }, [
    paapi.adsAndBidders,
    paapi.auctionEvents,
    prebidAdunits,
    prebidAuctionEvents,
  ]);

  const adUnitsAuctionId = useMemo(() => {
    const _adUnitsAuctionId: Record<string, Record<string, string>> = {};

    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAuctionEvents || {}).forEach((events) => {
        if (!events?.length || !events[0]?.adUnitCodes?.length) {
          return;
        }

        const _adUnits = events[0].adUnitCodes as string[];
        const time = new Date(events[0].timestamp).toISOString();

        _adUnits.forEach((adUnit) => {
          if (!_adUnitsAuctionId[adUnit]) {
            _adUnitsAuctionId[adUnit] = {};
          }

          _adUnitsAuctionId[adUnit][time] = events[0].auctionId;
        });
      });
    } else if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      const _adUnits = Object.keys(paapi.adsAndBidders);

      _adUnits.forEach((adUnit) => {
        const events = paapi.auctionEvents?.[adUnit];

        if (Object.keys(events || {}).length > 0) {
          Object.keys(events || {}).forEach((time) => {
            if (!_adUnitsAuctionId[adUnit]) {
              _adUnitsAuctionId[adUnit] = {};
            }

            _adUnitsAuctionId[adUnit][time.split('||')[0]] =
              time.split('||')[1];
          });
        }
      });
    }

    return _adUnitsAuctionId;
  }, [
    paapi.adsAndBidders,
    paapi.auctionEvents,
    prebidAdunits,
    prebidAuctionEvents,
  ]);

  const adUnitsMediaContainerSize = useMemo(() => {
    const _adUnitsMediaContainerSizeStore: Record<
      string,
      Record<string, Set<string>>
    > = {
      prebid: {},
      paapi: {},
    };

    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAdunits).forEach((data) => {
        const mediaContainerSize = data.mediaContainerSize as number[][];

        if (mediaContainerSize) {
          if (!_adUnitsMediaContainerSizeStore.prebid[data.adUnitCode]) {
            _adUnitsMediaContainerSizeStore.prebid[data.adUnitCode] = new Set();
          }

          _adUnitsMediaContainerSizeStore.prebid[data.adUnitCode].add(
            mediaContainerSize.map((size) => size.join('x')).join(',')
          );
        }
      });
    }

    if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      Object.values(paapi.adsAndBidders).forEach((data) => {
        const mediaContainerSize = data.mediaContainerSize as number[][];

        if (mediaContainerSize) {
          if (!_adUnitsMediaContainerSizeStore.paapi[data.adUnitCode]) {
            _adUnitsMediaContainerSizeStore.paapi[data.adUnitCode] = new Set();
          }

          _adUnitsMediaContainerSizeStore.paapi[data.adUnitCode].add(
            mediaContainerSize.map((size) => size.join('x')).join(',')
          );
        }
      });
    }

    const organize = (store: Record<string, Set<string>>, key: string) => {
      return Object.entries(store).reduce((acc, [adunit, sizes]) => {
        const _sizes = Array.from(sizes)
          .map((size) => size.split(','))
          .flat();

        const parsedSizes = _sizes.map((size) => {
          const [width, height] = size.split('x').map(Number);

          return [width, height];
        });

        if (!acc[adunit]) {
          acc[adunit] = {};
        }

        if (!acc[adunit][key]) {
          acc[adunit][key] = [];
        }

        acc[adunit][key] = parsedSizes;

        return acc;
      }, {} as Record<string, Record<string, number[][]>>);
    };

    const _adUnitsMediaContainerSize: Record<
      string,
      Record<string, number[][]>
    > = {
      ...organize(_adUnitsMediaContainerSizeStore.prebid || {}, 'prebid'),
      ...organize(_adUnitsMediaContainerSizeStore.paapi || {}, 'paapi'),
    };

    return _adUnitsMediaContainerSize;
  }, [paapi.adsAndBidders, prebidAdunits]);

  const adUnitsBidders = useMemo(() => {
    const _adUnitBidders: Record<string, Record<string, string[]>> = {};
    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAdunits).forEach((data) => {
        const bidders = data.bidders as string[];

        if (!bidders?.length) {
          return;
        }

        _adUnitBidders[data.adUnitCode] = {
          prebid: bidders,
        };

        _adUnitBidders[data.adUnitCode] = {
          ..._adUnitBidders[data.adUnitCode],
          prebid: [...new Set(_adUnitBidders[data.adUnitCode].prebid)],
        };
      });
    }

    if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      Object.values(paapi.adsAndBidders).forEach((data) => {
        const bidders = data.bidders as string[];

        if (!bidders?.length) {
          return;
        }

        _adUnitBidders[data.adUnitCode] = {
          ..._adUnitBidders[data.adUnitCode],
          paapi: bidders,
        };

        _adUnitBidders[data.adUnitCode] = {
          ..._adUnitBidders[data.adUnitCode],
          paapi: [...new Set(_adUnitBidders[data.adUnitCode].paapi)],
        };
      });
    }

    return _adUnitBidders;
  }, [paapi.adsAndBidders, prebidAdunits]);

  const adUnitsBidsCount = useMemo(() => {
    const _adUnitBidsCount: Record<string, Record<string, number>> = {};

    if (Object.keys(prebidReceivedBids || {}).length > 0) {
      Object.values(prebidReceivedBids).forEach((data) => {
        const adUnit = data.adUnitCode as string;

        if (adUnit) {
          _adUnitBidsCount[adUnit] = {
            ..._adUnitBidsCount[adUnit],
            prebid: (_adUnitBidsCount[adUnit]?.prebid || 0) + 1,
          };
        }
      });
    }

    if (Object.keys(paapi?.receivedBids || {}).length > 0) {
      Object.values(paapi.receivedBids).forEach((data) => {
        const adUnit = data.adUnitCode as string;

        if (adUnit) {
          _adUnitBidsCount[adUnit] = {
            ..._adUnitBidsCount[adUnit],
            paapi: (_adUnitBidsCount[adUnit]?.paapi || 0) + 1,
          };
        }
      });
    }

    return _adUnitBidsCount;
  }, [paapi.receivedBids, prebidReceivedBids]);

  const adUnitsNoBidsCount = useMemo(() => {
    const _adUnitNoBidsCount: Record<string, Record<string, number>> = {};

    if (Object.keys(prebidNoBids || {}).length > 0) {
      Object.values(prebidNoBids).forEach((data) => {
        const adUnit = data.adUnitCode as string;
        if (adUnit) {
          _adUnitNoBidsCount[adUnit] = {
            ..._adUnitNoBidsCount[adUnit],
            prebid:
              (_adUnitNoBidsCount[adUnit]?.prebid || 0) + data.bidder.length,
          };
        }
      });
    }

    if (Object.keys(paapi?.noBids || {}).length > 0) {
      Object.values(paapi.noBids).forEach((data) => {
        const adUnit = data.adUnitCode as string;

        if (adUnit) {
          _adUnitNoBidsCount[adUnit] = {
            ..._adUnitNoBidsCount[adUnit],
            paapi: (_adUnitNoBidsCount[adUnit]?.paapi || 0) + 1,
          };
        }
      });
    }

    return _adUnitNoBidsCount;
  }, [paapi.noBids, prebidNoBids]);

  const adUnitsWinnerBid = useMemo(() => {
    const _adUnitWinnerBid: Record<string, Record<string, string>> = {};

    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAdunits).forEach((data) => {
        const winnerBid = data.winningBidder as string;

        if (winnerBid) {
          _adUnitWinnerBid[data.adUnitCode] = {
            ..._adUnitWinnerBid[data.adUnitCode],
            prebid: winnerBid,
          };
        }
      });
    }

    if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      Object.values(paapi.adsAndBidders).forEach((data) => {
        const winnerBid = data.winningBidder as string;

        if (winnerBid) {
          _adUnitWinnerBid[data.adUnitCode] = {
            ..._adUnitWinnerBid[data.adUnitCode],
            paapi: winnerBid,
          };
        }
      });
    }

    return _adUnitWinnerBid;
  }, [paapi.adsAndBidders, prebidAdunits]);

  const adUnitsWinnerContainerSize = useMemo(() => {
    const _adUnitWinnerContainerSize: Record<
      string,
      Record<string, number[]>
    > = {};

    if (Object.keys(prebidAdunits || {}).length > 0) {
      Object.values(prebidAdunits).forEach((data: any) => {
        const mediaContainerSize = data
          ?.winningMediaContainerSize?.[0] as number[];

        if (mediaContainerSize) {
          _adUnitWinnerContainerSize[data.adUnitCode] = {
            ..._adUnitWinnerContainerSize[data.adUnitCode],
            prebid: mediaContainerSize,
          };
        }
      });
    }
    if (Object.keys(paapi?.adsAndBidders || {}).length > 0) {
      Object.values(paapi.adsAndBidders).forEach((data: any) => {
        const mediaContainerSize = data?.winningMediaContainerSize as number[];

        if (mediaContainerSize) {
          _adUnitWinnerContainerSize[data.adUnitCode] = {
            ..._adUnitWinnerContainerSize[data.adUnitCode],
            paapi: mediaContainerSize,
          };
        }
      });
    }

    return _adUnitWinnerContainerSize;
  }, [paapi.adsAndBidders, prebidAdunits]);

  const getPrebidData = useCallback(
    (adUnit: string, time: string) => {
      const auction = Object.entries(prebidAuctionEvents || {}).find(
        ([, events]) => {
          if (!events?.length || !events[0]?.adUnitCodes?.length) {
            return false;
          }

          return (
            events[0].adUnitCodes.includes(adUnit) &&
            new Date(events[0].timestamp).toISOString() === time
          );
        }
      );

      return auction;
    },
    [prebidAuctionEvents]
  );

  const getPAData = useCallback(
    (adUnit: string, time: string, parentAuctionId: string) => {
      const adUnitEvents =
        paapi.auctionEvents?.[adUnit]?.[time + '||' + parentAuctionId] || {};

      const sellerUrl = Object.keys(adUnitEvents)?.[0];

      const nonSplittedSellerUrl =
        Object.keys(adUnitEvents?.[sellerUrl] || {})?.[0] || '';

      const entries = Object.entries(adUnitEvents?.[sellerUrl] || {})
        .filter(([url]) => {
          const splittedUrl = url.split('||');

          if (isMultiSeller) {
            return !(
              splittedUrl[0] === sellerUrl && splittedUrl[1] === parentAuctionId
            );
          }
          return splittedUrl[0] !== sellerUrl;
        })
        .reduce((acc, [url, events]) => {
          acc[url.split('||')[0] + time + adUnit] = {
            key: url.split('||')[0] + time + adUnit,
            title: events[0]?.auctionConfig?.seller ?? url.split('||')[0],
            auctionEvents: events,
            parentOrigin: events[0]?.auctionConfig?.seller,
            startDate: time,
            isBlurred: events.length === 0,
          };

          return acc;
        }, {} as Record<string, unknown>);

      const adUnitdata = {
        [`${time}||${parentAuctionId}||${adUnit}`]: {
          key: `${time}||${parentAuctionId}||${adUnit}`,
          title: 'PAAPI',
          auctionEvents:
            adUnitEvents?.[sellerUrl]?.[nonSplittedSellerUrl] || [],
          parentOrigin:
            adUnitEvents?.[sellerUrl]?.[nonSplittedSellerUrl][0]?.auctionConfig
              ?.seller || '',
          startDate: time,
          children: entries,
          isBlurred: !adUnitEvents[sellerUrl]?.[nonSplittedSellerUrl]?.length,
        },
      };

      return adUnitdata;
    },
    [isMultiSeller, paapi.auctionEvents]
  );

  const receivedBids = useMemo(() => {
    return {
      prebid: prebidReceivedBids,
      paapi: paapi.receivedBids,
    };
  }, [prebidReceivedBids, paapi.receivedBids]);

  return {
    adUnits,
    adUnitsTimestamp,
    adUnitsAuctionId,
    adUnitsMediaContainerSize,
    adUnitsBidsCount,
    adUnitsNoBidsCount,
    adUnitsBidders,
    adUnitsWinnerBid,
    adUnitsWinnerContainerSize,
    receivedBids,
    getPrebidData,
    getPAData,
  };
};

export default useDataProcessing;

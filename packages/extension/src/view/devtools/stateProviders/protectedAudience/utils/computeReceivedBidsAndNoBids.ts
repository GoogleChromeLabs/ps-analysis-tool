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
import type {
  MultiSellerAuction,
  NoBidsType,
  ReceivedBids,
  SingleSellerAuction,
} from '@google-psat/common';

const BIDDING_TYPES = [
  'bid',
  'additionalBid',
  'topLevelBid',
  'topLevelAdditionalBid',
];

/**
 * This function computes the received bids and no bids data to be displayed in the PSAT extension.
 * @param _auctionEvents The array of auction events that are associated with the tab.
 * @param _isMultiSellerAuction This speicifes if the auction event occuring is multi seller auction or single seller auction.
 * @returns null | receivedBids array and noBids object.
 */
function computeReceivedBidsAndNoBids(
  _auctionEvents: SingleSellerAuction | MultiSellerAuction | null,
  _isMultiSellerAuction: boolean
) {
  if (
    !_auctionEvents ||
    (_auctionEvents && Object.keys(_auctionEvents).length === 0)
  ) {
    return null;
  }

  const _receivedBids: ReceivedBids[] = [];
  const _noBids: NoBidsType = {};

  const _interestGroupBuyers = new Set<string>();

  if (_isMultiSellerAuction) {
    const multisellerAuctionEvents = _auctionEvents as MultiSellerAuction;

    Object.keys(multisellerAuctionEvents).forEach((parentAuctionId) => {
      Object.keys(multisellerAuctionEvents[parentAuctionId]).forEach(
        (uniqueAuctionId) => {
          if ('globalEvents' === uniqueAuctionId) {
            return;
          }

          const { auctionConfig, uniqueAuctionId: _uniqueAuctionId } =
            multisellerAuctionEvents[parentAuctionId]?.[
              uniqueAuctionId
            ]?.filter(({ type }) => type && type === 'configResolved')?.[0] ??
            {};

          const { name } =
            multisellerAuctionEvents[parentAuctionId]?.[uniqueAuctionId]?.find(
              (event) => event?.eventType === 'interestGroupAccessed'
            ) ?? {};

          //@ts-ignore
          auctionConfig?.interestGroupBuyers?.forEach((element) => {
            _interestGroupBuyers.add(element);
          });

          const filteredEvents = multisellerAuctionEvents[parentAuctionId][
            uniqueAuctionId
          ].filter(
            (event) =>
              event.eventType === 'interestGroupAccessed' &&
              BIDDING_TYPES.includes(event.type)
          );

          _receivedBids.push(
            ...filteredEvents.map((event) => {
              let auctionSignals = JSON.parse(
                // @ts-ignore - auctionSignals is not defined in type, but it is in the data
                auctionConfig?.auctionSignals?.value ?? '{}'
              ).divId;

              if (auctionSignals) {
                auctionSignals = JSON.parse(
                  // @ts-ignore - auctionSignals is not defined in type, but it is in the data
                  auctionConfig?.auctionSignals?.value ?? '{}'
                );
              } else {
                auctionSignals = JSON.parse(
                  // @ts-ignore - sellerSignals is not defined in type, but it is in the data
                  auctionConfig?.sellerSignals?.value ?? '{}'
                );
              }

              const actualAuctionSignals =
                auctionSignals?.adUnit ?? auctionSignals;
              const mediaContainerSize = Array.isArray(
                actualAuctionSignals?.size
              )
                ? actualAuctionSignals?.size
                : actualAuctionSignals?.size?.split(',');

              return {
                ...event,
                mediaContainerSize: [mediaContainerSize],
                adUnitCode: actualAuctionSignals?.divId,
                adType: actualAuctionSignals?.adType,
              };
            })
          );

          if (_interestGroupBuyers.size > 0) {
            const buyersWhoBid = new Set<string>();

            _receivedBids.forEach((event) => {
              if (event.ownerOrigin) {
                buyersWhoBid.add(event.ownerOrigin);
              }
            });

            Array.from(_interestGroupBuyers.difference(buyersWhoBid)).forEach(
              (buyer) => {
                const auctionId =
                  uniqueAuctionId === '0' ? _uniqueAuctionId : uniqueAuctionId;

                if (!auctionId) {
                  return;
                }

                let auctionSignals = JSON.parse(
                  // @ts-ignore - auctionSignals is not defined in type, but it is in the data
                  auctionConfig?.auctionSignals?.value ?? '{}'
                ).divId;

                if (auctionSignals) {
                  auctionSignals = JSON.parse(
                    // @ts-ignore - auctionSignals is not defined in type, but it is in the data
                    auctionConfig?.auctionSignals?.value ?? '{}'
                  );
                } else {
                  auctionSignals = JSON.parse(
                    // @ts-ignore - sellerSignals is not defined in type, but it is in the data
                    auctionConfig?.sellerSignals?.value ?? '{}'
                  );
                }

                const actualAuctionSignals =
                  auctionSignals?.adUnit ?? auctionSignals;

                _noBids[auctionId] = {
                  ownerOrigin: buyer,
                  name: name ?? '',
                  uniqueAuctionId: auctionId,
                  adUnitCode: actualAuctionSignals?.divId,
                };
              }
            );
          }
        }
      );
    });
  } else {
    const singleSellerAuctionEvents = _auctionEvents as SingleSellerAuction;

    Object.keys(singleSellerAuctionEvents).forEach((uniqueAuctionId) => {
      if ('globalEvents' === uniqueAuctionId) {
        return;
      }

      const filteredEvents = singleSellerAuctionEvents[uniqueAuctionId].filter(
        (event) =>
          event.eventType === 'interestGroupAccessed' &&
          BIDDING_TYPES.includes(event.type)
      );

      const { auctionConfig } =
        singleSellerAuctionEvents?.[uniqueAuctionId]?.filter(
          ({ type }) => type && type === 'configResolved'
        )?.[0] ?? {};

      _receivedBids.push(
        ...filteredEvents.map((event) => {
          let auctionSignals = JSON.parse(
            // @ts-ignore - auctionSignals is not defined in type, but it is in the data
            auctionConfig?.auctionSignals?.value ?? '{}'
          ).divId;

          if (auctionSignals) {
            auctionSignals = JSON.parse(
              // @ts-ignore - auctionSignals is not defined in type, but it is in the data
              auctionConfig?.auctionSignals?.value ?? '{}'
            );
          } else {
            auctionSignals = JSON.parse(
              // @ts-ignore - sellerSignals is not defined in type, but it is in the data
              auctionConfig?.sellerSignals?.value ?? '{}'
            );
          }

          const actualAuctionSignals = auctionSignals?.adUnit ?? auctionSignals;
          const mediaContainerSize = Array.isArray(actualAuctionSignals?.size)
            ? actualAuctionSignals?.size
            : actualAuctionSignals?.size?.split(',');

          return {
            ...event,
            mediaContainerSize: [mediaContainerSize],
            adUnitCode: actualAuctionSignals?.divId,
            adType: actualAuctionSignals?.adType,
          };
        })
      );

      const { name } =
        singleSellerAuctionEvents[uniqueAuctionId]?.find(
          (event) => event?.eventType === 'interestGroupAccessed'
        ) ?? {};

      if (_interestGroupBuyers.size > 0) {
        const buyersWhoBid = new Set<string>();

        _receivedBids.forEach((event) => {
          if (event.ownerOrigin) {
            buyersWhoBid.add(event.ownerOrigin);
          }
        });

        Array.from(_interestGroupBuyers.difference(buyersWhoBid)).forEach(
          (buyer) => {
            let auctionSignals = JSON.parse(
              // @ts-ignore - auctionSignals is not defined in type, but it is in the data
              auctionConfig?.auctionSignals?.value ?? '{}'
            ).divId;

            if (auctionSignals) {
              auctionSignals = JSON.parse(
                // @ts-ignore - auctionSignals is not defined in type, but it is in the data
                auctionConfig?.auctionSignals?.value ?? '{}'
              );
            } else {
              auctionSignals = JSON.parse(
                // @ts-ignore - sellerSignals is not defined in type, but it is in the data
                auctionConfig?.sellerSignals?.value ?? '{}'
              );
            }
            const actualAuctionSignals =
              auctionSignals?.adUnit ?? auctionSignals;

            _noBids[uniqueAuctionId] = {
              ownerOrigin: buyer,
              name: name ?? '',
              //@ts-ignore -- since auction config is of type object but we know what data is being passed in this.
              adUnitCode: actualAuctionSignals?.divId,
              uniqueAuctionId,
            };
          }
        );
      }
    });
  }

  return { receivedBids: _receivedBids, noBids: _noBids };
}

export default computeReceivedBidsAndNoBids;

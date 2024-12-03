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
import React, { useMemo } from 'react';
import { MatrixComponent } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import { useProtectedAudience } from '../../../../../stateProviders';

interface MatrixData {
  adUnitCode: string;
}

const Matrix = ({ adUnitCode }: MatrixData) => {
  const { adsAndBidders, receivedBids, noBids } = useProtectedAudience(
    ({ state }) => ({
      adsAndBidders: state.adsAndBidders,
      receivedBids: state.receivedBids,
      noBids: state.noBids,
    })
  );

  const biddersCount = useMemo(() => {
    const bidders = Object.values(adsAndBidders).reduce((acc, ad) => {
      if (adUnitCode !== ad.adUnitCode) {
        return acc;
      }

      if (ad.bidders) {
        ad.bidders.forEach((bidder) => {
          acc.add(bidder);
        });
      }
      return acc;
    }, new Set());

    return bidders.size;
  }, [adUnitCode, adsAndBidders]);

  const matrixData = useMemo(
    () => [
      {
        title: 'Bidders',
        count: biddersCount,
        color: '#F3AE4E',
        description: 'Placeholder',
        countClassName: 'text-[#F3AE4E]',
      },
      {
        title: 'Bids',
        count: receivedBids.filter((bid) => bid.adUnitCode === adUnitCode)
          .length,
        color: '#4C79F4',
        description: 'Placeholder',
        countClassName: 'text-[#4C79F4]',
      },
      {
        title: 'No Bids',
        count: Object.values(noBids).filter(
          (bid) => bid.adUnitCode === adUnitCode
        ).length,
        color: '#EC7159',
        description: 'Placeholder',
        countClassName: 'text-[#EC7159]',
      },
    ],
    [adUnitCode, biddersCount, noBids, receivedBids]
  );

  return (
    <div className="grid grid-cols-4 gap-x-2 max-w-2xl">
      {matrixData.map((dataComponent, index) => {
        if (dataComponent && dataComponent.countClassName) {
          return (
            <div key={index} className={'py-1'}>
              <button className="p-3.5 w-full box-border cursor-default">
                <MatrixComponent
                  {...dataComponent}
                  countClassName={
                    dataComponent.countClassName + ' text-xxl leading-none'
                  }
                />
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Matrix;

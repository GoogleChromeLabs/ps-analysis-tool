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
import { getCircleDatetime } from '@google-psat/explorable-explanations';

/**
 * Internal dependencies
 */
import { SYNTHETIC_INTEREST_GROUPS } from './constants';

interface SingleAd {
  renderURL: string;
  metadata: string;
}
export const transformInterestGroup = (site: string) => {
  let interestGroups = SYNTHETIC_INTEREST_GROUPS[site];

  interestGroups = interestGroups.map((interestGroup, index) => {
    interestGroup.details.biddingLogicURL =
      interestGroup.details.biddingLogicURL.replace(
        'https://privacysandboxdemos-buyer-1.domain-aaa.com',
        interestGroup.ownerOrigin
      );
    interestGroup.details.joiningOrigin =
      interestGroup.details.joiningOrigin.replace(
        'https://privacysandboxdemos-buyer-1.domain-aaa.com',
        interestGroup.ownerOrigin
      );
    interestGroup.details.trustedBiddingSignalsURL =
      interestGroup.details.trustedBiddingSignalsURL.replace(
        'https://privacysandboxdemos-buyer-1.domain-aaa.com',
        interestGroup.ownerOrigin
      );

    interestGroup.details.ads = interestGroup.details.ads.map(
      (ad: SingleAd) => {
        ad.renderURL = ad.renderURL.replace(
          'https://privacysandboxdemos-buyer-1.domain-aaa.com',
          interestGroup.ownerOrigin ?? ''
        );
        return ad;
      }
    );

    const circleDateTime = getCircleDatetime(site);
    const date = new Date(circleDateTime.replace('T', ' ').replace('-', '/'));

    interestGroup.time = (date.getTime() + index * 100) / 1000;

    interestGroup.details.expirationTime =
      new Date(
        interestGroup.time * 1000 + 10 * 60 * 60 * 1000 + index * 1000
      ).getTime() / 1000;

    return interestGroup;
  });

  return interestGroups;
};

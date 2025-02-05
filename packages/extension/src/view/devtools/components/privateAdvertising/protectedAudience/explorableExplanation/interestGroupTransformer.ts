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
 * Internal dependencies
 */
import { SYNTHETIC_INTEREST_GROUPS } from './constants';

export const transformInterestGroup = (site: string) => {
  let interestGroups = SYNTHETIC_INTEREST_GROUPS[site];
  interestGroups = interestGroups.map((interestGroup) => {
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

    interestGroup.details.ads = interestGroup.details.ads.map((ad) => {
      ad.renderURL = ad.renderURL.replace(
        'https://privacysandboxdemos-buyer-1.domain-aaa.com',
        interestGroup.ownerOrigin
      );
      return ad;
    });

    return interestGroup;
  });

  return interestGroups;
};

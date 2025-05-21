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
 * Internal dependencies.
 */
import { noop } from '@google-psat/common';
import { type PrebidInterfaceType } from '../prebid/prebidInterface';
/**
 * This function checks if Prebid is present on the page and initialises the prebid object to send and receive messages.
 * @param classToInstantiate This is the class that will be instantiated to check for Prebid.
 * @returns {void}
 */
function doesPrebidExist(classToInstantiate: PrebidInterfaceType) {
  let stopLoop = false;
  const pbjsClass = new classToInstantiate();

  const timeout = setTimeout(() => {
    stopLoop = true;
    pbjsClass.scanningStatus = true;
  }, 60000);

  const isPrebidInPage = () => {
    //@ts-ignore
    const pbjsGlobals = window._pbjsGlobals ?? [];

    if (pbjsGlobals?.length > 0) {
      pbjsClass.prebidInterface = window[
        pbjsGlobals[0]
      ] as unknown as typeof window.pbjs;

      pbjsClass.prebidExists = true;
      pbjsClass.scanningStatus = true;

      pbjsClass.sendInitialData();
      pbjsClass.initPrebidListener();

      pbjsClass.prebidData.pbjsNamespace = pbjsGlobals[0];

      pbjsClass.prebidData.versionInfo =
        pbjsClass.prebidInterface.version ?? '';

      pbjsClass.prebidData.installedModules =
        pbjsClass.prebidInterface.installedModules ?? [];

      const bidderSettings: Record<string, SingleBidderSetting> = {};

      Object.keys(pbjsClass?.prebidInterface?.bidderSettings ?? {}).forEach(
        (bidder) => {
          bidderSettings[bidder] = {};

          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            bidCpmAdjustment = noop,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            adserverTargeting = [],
            ...rest
          } = pbjsClass.prebidInterface?.bidderSettings[bidder] ?? {};

          bidderSettings[bidder] = {
            ...rest,
          };
        }
      );

      pbjsClass.prebidData.config = {
        ...(pbjsClass.prebidInterface?.getConfig() ?? {}),
        bidderSettings,
      };

      stopLoop = true;
      clearTimeout(timeout);
    }

    if (!stopLoop) {
      setTimeout(() => isPrebidInPage(), 1000);
    }
  };

  isPrebidInPage();
}

export default doesPrebidExist;

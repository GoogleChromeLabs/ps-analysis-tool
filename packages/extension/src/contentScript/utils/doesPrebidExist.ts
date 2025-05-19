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
import { type PrebidInterfaceType } from '../prebid/prebidInterface';
/**
 * Checks if the Prebid.js library exists on the current webpage and initializes
 * the provided Prebid interface class accordingly. The function continuously scans
 * for the presence of Prebid.js until it is found or a timeout occurs.
 * @param classToInstantiate - A class that implements the `PrebidInterfaceType` interface.
 *                             This class will be instantiated and used to interact with
 *                             the Prebid.js library if it is found on the page.
 *
 * The function performs the following steps:
 * 1. Instantiates the provided class and starts scanning for the Prebid.js library.
 * 2. If the Prebid.js library is detected, it initializes the `prebidInterface` property
 *    of the instantiated class with the global Prebid.js object.
 * 3. Sets the `prebidExists` and `scanningStatus` properties of the instantiated class
 *    to indicate the presence of Prebid.js and the completion of the scanning process.
 * 4. Calls the `sendInitialData` and `initPrebidListener` methods of the instantiated class
 *    to handle further interactions with Prebid.js.
 * 5. Stops scanning either when Prebid.js is found or after a timeout of 60 seconds.
 *
 * Note: The function uses a recursive `setTimeout` to periodically check for the presence
 * of Prebid.js on the page.
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

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
 * External dependencies.
 */
import React, { useState } from 'react';
import {
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  useTabs,
  PillToggle,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { useSettings } from '../../../../stateProviders';
import PrebidBidsPanel from './prebid';
import PaapiBidsPanel from './paapi';

enum PillToggleOptions {
  PREBID = 'Prebid',
  PAAPI = 'PAAPI',
}

const Bids = () => {
  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.PREBID
  );

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view bids data, enable PSAT to use CDP via the{' '}
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={() => {
              document
                .getElementById('cookies-landing-scroll-container')
                ?.scrollTo(0, 0);
              updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
            }}
          >
            Settings Page
          </button>
          .
        </p>
      </div>
    );
  }

  // <Panel storage={storage} setStorage={setStorage} />

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-4 pb-2 pt-4">
        <PillToggle
          options={[PillToggleOptions.PREBID, PillToggleOptions.PAAPI]}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={false}
        />
      </div>
      {pillToggle === PillToggleOptions.PREBID ? (
        <PrebidBidsPanel storage={storage} setStorage={setStorage} />
      ) : (
        <PaapiBidsPanel storage={storage} setStorage={setStorage} />
      )}
    </div>
  );
};

export default Bids;

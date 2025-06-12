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
 * External dependencies
 */
import { Button, ToggleSwitch } from '@google-psat/design-system';
import { type PrebidDebugModuleConfig } from '@google-psat/common';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

interface HeaderComponentProps {
  setDebuggingModuleConfig: Dispatch<SetStateAction<PrebidDebugModuleConfig>>;
  storeRulesInLocalStorage: boolean;
  debuggingEnabled: boolean;
  handleChangeStoreRulesInLocalStorage: (value: boolean) => void;
  openGoogleManagerConsole: () => void;
}
const HeaderComponent = ({
  setDebuggingModuleConfig,
  storeRulesInLocalStorage,
  debuggingEnabled,
  handleChangeStoreRulesInLocalStorage,
  openGoogleManagerConsole,
}: HeaderComponentProps) => {
  const [isGAMReady, setIsGAMReady] = useState<boolean>(false);

  useEffect(() => {
    chrome.devtools.inspectedWindow.eval(
      `(function() {
    try {
      const gtag = window.googletag;
      if (gtag && gtag.apiReady && typeof gtag.pubads === 'function') {
        const slots = gtag.pubads().getSlots();
        return { isReady: true, slotCount: slots.length };
      }
      return { isReady: false, slotCount: 0 };
    } catch (e) {
      return { isReady: false, slotCount: 0 };
    }
  })()`,
      (res: { isReady: boolean }, ex) => {
        if (!ex) {
          setIsGAMReady(res?.isReady);
        }
      }
    );
  }, []);

  return (
    <div className="flex justify-between mt-6">
      <Button
        text="Open Google Ad Manager Console"
        extraClasses="text-base"
        onClick={openGoogleManagerConsole}
        disabled={!isGAMReady}
        title={
          isGAMReady
            ? ''
            : 'Google Ad Manager Console either not ready or not available on this page'
        }
      />
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center">
          <ToggleSwitch
            enabled={debuggingEnabled}
            setEnabled={(value) =>
              setDebuggingModuleConfig((prevState) => {
                return {
                  ...prevState,
                  enabled: value,
                };
              })
            }
          />
          <span className="text-base text-raisin-black dark:text-bright-gray">
            Enable Debugging
          </span>
        </div>
        <div className="flex flex-row items-center">
          <ToggleSwitch
            enabled={storeRulesInLocalStorage}
            setEnabled={handleChangeStoreRulesInLocalStorage}
          />
          <span className="text-base text-raisin-black dark:text-bright-gray">
            Store rules in local storage
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;

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
import { Button, Plus, ToggleSwitch } from '@google-psat/design-system';
import { noop } from '@google-psat/common';
import type { Dispatch, SetStateAction } from 'react';

interface HeaderComponentProps {
  setDebuggingModuleConfig: Dispatch<SetStateAction<PrebidDebugModuleConfig>>;
  storeRulesInLocalStorage: boolean;
  handleChangeStoreRulesInLocalStorage: (value: boolean) => void;
}
const HeaderComponent = ({
  setDebuggingModuleConfig,
  storeRulesInLocalStorage,
  handleChangeStoreRulesInLocalStorage,
}: HeaderComponentProps) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        text="Open Google Ad Manager Console"
        extraClasses="text-base"
        onClick={noop}
      />
      <div className="flex flex-row items-center">
        <ToggleSwitch
          enabled={storeRulesInLocalStorage}
          setEnabled={handleChangeStoreRulesInLocalStorage}
        />
        <span className="text-base text-raisin-black dark:text-bright-gray">
          Store rules in local storage
        </span>
      </div>
      <Button
        title="Add rule"
        type="button"
        text={
          <div className="cursor-pointer flex flex-row gap-1 items-center">
            <Plus className="w-4 h-4 text-raisin-black dark:text-bright-gray" />
            <span className="text-base text-raisin-black dark:text-bright-gray">
              Add rule
            </span>
          </div>
        }
        onClick={() =>
          setDebuggingModuleConfig((prevState) => {
            return {
              ...prevState,
              intercept: [
                ...prevState.intercept,
                { when: { adUnitCode: '' }, then: { cpm: 20 } },
              ],
            };
          })
        }
      />
    </div>
  );
};
export default HeaderComponent;

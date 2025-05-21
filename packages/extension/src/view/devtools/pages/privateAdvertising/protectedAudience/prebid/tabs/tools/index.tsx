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
import { Button, Plus } from '@google-psat/design-system';
/**
 * Internal dependencies
 */
import usePrebidTool from './hooks/usePrebidTool';
import HeaderComponent from './components/headerComponent';
import RuleComponent from './components/ruleComponent';

const Tools = () => {
  const {
    debuggingModuleConfig,
    setDebuggingModuleConfig,
    changeRule,
    addRule,
    storeRulesInLocalStorage,
    handleChangeStoreRulesInLocalStorage,
  } = usePrebidTool();

  return (
    <div className="flex flex-col w-full h-full px-4 relative">
      <HeaderComponent
        handleChangeStoreRulesInLocalStorage={
          handleChangeStoreRulesInLocalStorage
        }
        storeRulesInLocalStorage={storeRulesInLocalStorage}
        debuggingEnabled={debuggingModuleConfig.enabled ?? false}
        setDebuggingModuleConfig={setDebuggingModuleConfig}
      />
      <div className="flex flex-col w-full h-fit gap-10 items-start mt-2 rounded-sm border px-4 py-3">
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
        {debuggingModuleConfig.intercept.map((rule, ruleIndex) => {
          return (
            <RuleComponent
              setDebuggingModuleConfig={setDebuggingModuleConfig}
              key={ruleIndex}
              changeRule={changeRule}
              addRule={addRule}
              ruleIndex={ruleIndex}
              rule={rule}
            />
          );
        })}
      </div>
    </div>
  );
};
export default Tools;

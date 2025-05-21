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
    <div className="flex flex-col w-full h-full px-3 relative">
      <HeaderComponent
        handleChangeStoreRulesInLocalStorage={
          handleChangeStoreRulesInLocalStorage
        }
        storeRulesInLocalStorage={storeRulesInLocalStorage}
        setDebuggingModuleConfig={setDebuggingModuleConfig}
      />
      <div className="flex flex-col w-full h-fit shadow-lg px-3 gap-10 items-start mt-6 py-3 rounded-sm">
        {debuggingModuleConfig.intercept.map((rule, ruleIndex) => {
          return (
            <RuleComponent
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

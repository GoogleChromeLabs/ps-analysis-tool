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
import classNames from 'classnames';
/**
 * Internal dependencies
 */
import HeaderComponent from './components/headerComponent';
import RuleComponent from './components/ruleComponent';
import { usePrebid } from '../../../../../../stateProviders';

const Tools = () => {
  const {
    debuggingModuleConfig,
    setDebuggingModuleConfig,
    changeRule,
    addRule,
    storeRulesInLocalStorage,
    openGoogleManagerConsole,
    handleChangeStoreRulesInLocalStorage,
  } = usePrebid(({ state, actions }) => ({
    debuggingModuleConfig: state.debuggingModuleConfig,
    setDebuggingModuleConfig: actions.setDebuggingModuleConfig,
    changeRule: actions.changeRule,
    addRule: actions.addRule,
    storeRulesInLocalStorage: state.storeRulesInLocalStorage,
    openGoogleManagerConsole: actions.openGoogleManagerConsole,
    handleChangeStoreRulesInLocalStorage:
      actions.handleChangeStoreRulesInLocalStorage,
  }));

  return (
    <div className="flex flex-col w-full h-full relative">
      <HeaderComponent
        openGoogleManagerConsole={openGoogleManagerConsole}
        handleChangeStoreRulesInLocalStorage={
          handleChangeStoreRulesInLocalStorage
        }
        storeRulesInLocalStorage={storeRulesInLocalStorage}
        debuggingEnabled={debuggingModuleConfig.enabled ?? false}
        setDebuggingModuleConfig={setDebuggingModuleConfig}
      />
      <div
        className={classNames(
          'flex flex-col w-full h-fit mt-2 rounded-sm border border-hex-gray dark:border-quartz px-4 py-3',
          {
            'items-start': debuggingModuleConfig.intercept.length > 0,
            'items-center': debuggingModuleConfig.intercept.length === 0,
          }
        )}
      >
        <Button
          dontShowBackground
          extraClasses={`${
            debuggingModuleConfig.intercept.length > 0 ? 'mb-8' : ''
          }`}
          title="Add rule"
          type="button"
          text={
            <div className="cursor-pointer flex flex-row gap-1 items-center">
              <Plus className="w-4 h-4 text-sapphire dark:text-baby-blue-eyes" />
              <span className="text-xs text-sapphire dark:text-baby-blue-eyes">
                ADD RULE
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
            <div className="w-full h-full mt-4" key={ruleIndex}>
              <RuleComponent
                setDebuggingModuleConfig={setDebuggingModuleConfig}
                key={ruleIndex}
                changeRule={changeRule}
                addRule={addRule}
                ruleIndex={ruleIndex}
                rule={rule}
              />
              {debuggingModuleConfig.intercept.length > 1 && (
                <div className="h-px bg-gray-200 dark:bg-quartz my-5 w-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Tools;
